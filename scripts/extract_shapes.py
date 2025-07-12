import cv2
import numpy as np
from PIL import Image
import os
import json

# --- CONFIG ---
INPUT_IMAGE = 'input.png'  # Change this to your input image path
OUTPUT_DIR = 'output_shapes'  # Directory to save results

# --- UTILS ---
def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def save_transparent_png(shape_mask, orig_img, bbox, out_path):
    x, y, w, h = bbox
    # Crop the shape
    cropped = orig_img[y:y+h, x:x+w]
    mask_cropped = shape_mask[y:y+h, x:x+w]
    # Create alpha channel
    alpha = (mask_cropped * 255).astype(np.uint8)
    rgba = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGBA)
    rgba[..., 3] = alpha
    Image.fromarray(rgba).save(out_path)

def main():
    ensure_dir(OUTPUT_DIR)
    # Load image
    img = cv2.imread(INPUT_IMAGE)
    if img is None:
        print(f'Error: Could not load {INPUT_IMAGE}')
        return
    orig_img = img.copy()
    # Convert to grayscale and threshold
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY_INV)
    # Find contours (shapes)
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # Prepare mask for background
    mask = np.ones(img.shape, dtype=np.uint8) * 255
    shape_info = []
    for i, cnt in enumerate(contours):
        # Create mask for this shape
        shape_mask = np.zeros(gray.shape, dtype=np.uint8)
        cv2.drawContours(shape_mask, [cnt], -1, 255, -1)
        # Remove shape from background mask
        cv2.drawContours(mask, [cnt], -1, (0,0,0), -1)
        # Get bounding box
        x, y, w, h = cv2.boundingRect(cnt)
        # Save shape as transparent PNG
        out_path = os.path.join(OUTPUT_DIR, f'shape_{i+1}.png')
        save_transparent_png(shape_mask, orig_img, (x, y, w, h), out_path)
        shape_info.append({'filename': f'shape_{i+1}.png', 'bbox': [int(x), int(y), int(w), int(h)]})
    # Save background image (shapes removed)
    bg = cv2.bitwise_and(orig_img, mask)
    bg_path = os.path.join(OUTPUT_DIR, 'background.png')
    cv2.imwrite(bg_path, bg)
    # Save shape info
    with open(os.path.join(OUTPUT_DIR, 'shapes.json'), 'w') as f:
        json.dump(shape_info, f, indent=2)
    print(f'Done! Results saved in {OUTPUT_DIR}')

if __name__ == '__main__':
    main()
