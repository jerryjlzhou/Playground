from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import tempfile
import os
from PIL import Image
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for React Native

@app.route('/process', methods=['POST'])
def process_image():
    try:
        # Get image from request
        file = request.files['image']
        
        # Save to temp file
        _, temp_path = tempfile.mkstemp(suffix='.png')
        file.save(temp_path)
        
        # Process image
        shapes = process_image_with_opencv(temp_path)
        
        # Clean up
        os.unlink(temp_path)
        
        return jsonify({'shapes': shapes, 'success': True})
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

def save_transparent_png_to_base64(shape_mask, orig_img, bbox):
    x, y, w, h = bbox
    # Crop the shape and mask
    cropped = orig_img[y:y+h, x:x+w]
    mask_cropped = shape_mask[y:y+h, x:x+w]
    # Create alpha channel: shape is opaque (255), background is transparent (0)
    alpha = np.where(mask_cropped > 0, 255, 0).astype(np.uint8)
    # Convert cropped image to RGBA
    rgba = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGBA)
    rgba[..., 3] = alpha
    # Set background pixels to fully transparent (0,0,0,0)
    rgba[(alpha == 0)] = [0, 0, 0, 0]
    
    # Convert to PIL Image and then to base64
    pil_image = Image.fromarray(rgba)
    import io
    buffer = io.BytesIO()
    pil_image.save(buffer, format='PNG')
    img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    return img_base64

def process_image_with_opencv(image_path):
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        raise Exception(f'Could not load image: {image_path}')
    
    orig_img = img.copy()
    
    # Convert to grayscale and threshold
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours (shapes)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    shapes_base64 = []
    min_area = 2000  # Increased minimum area to avoid text/noise (was 500)
    min_width = 30   # Minimum width to avoid text (was 5)
    min_height = 30  # Minimum height to avoid text (was 5)
    max_area = 100000 # Maximum area to avoid detecting the entire page
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area or area > max_area:
            continue  # Skip shapes that are too small or too large
            
        x, y, w, h = cv2.boundingRect(cnt)
        if w < min_width or h < min_height:
            continue  # Skip shapes that are too thin or small
            
        # Additional filter: reject very elongated shapes (likely text)
        aspect_ratio = max(w, h) / min(w, h)
        if aspect_ratio > 4:  # Skip very elongated shapes
            continue
            
        # Create mask for this shape
        shape_mask = np.zeros(gray.shape, dtype=np.uint8)
        cv2.drawContours(shape_mask, [cnt], -1, 255, -1)
        
        # Convert to base64
        shape_base64 = save_transparent_png_to_base64(shape_mask, orig_img, (x, y, w, h))
        shapes_base64.append(shape_base64)
    
    print(f'Processed {len(shapes_base64)} shapes')
    return shapes_base64

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print("Starting Flask server on http://0.0.0.0:5001")
    print("Make sure to update the SERVER_URL in your React Native app with your local IP")
    app.run(host='0.0.0.0', port=5001, debug=True)
