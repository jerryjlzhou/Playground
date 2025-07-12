import json
import os

import cv2
import numpy as np
from PIL import Image

# --- CONFIG ---
INPUT_IMAGE = 'input/testQ2.png'  # Updated to match actual image location
OUTPUT_DIR = 'components/ImageProcessing/output'  # Directory to save results

# --- UTILS ---
def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def save_transparent_png(shape_mask, orig_img, bbox, out_path):
    x, y, w, h = bbox
    # Crop the shape
    cropped = orig_img[y:y+h, x:x+w]
    # mask_cropped = shape_mask[y:y+h, x:x+w]
    # # Create alpha channel
    # alpha = (mask_cropped * 255).astype(np.uint8)
    rgba = cv2.cvtColor(cropped, cv2.COLOR_BGR2RGBA)
    # rgba[..., 3] = alpha
    Image.fromarray(rgba).save(out_path)

def main():
    # Clear out the output directory on each run
    if os.path.exists(OUTPUT_DIR):
        for filename in os.listdir(OUTPUT_DIR):
            file_path = os.path.join(OUTPUT_DIR, filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    import shutil
                    shutil.rmtree(file_path)
            except Exception as e:
                print(f'Failed to delete {file_path}. Reason: {e}')
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
    min_area = 500  # Minimum area in pixels for a shape to be considered valid
    min_width = 5   # Minimum width in pixels
    min_height = 5  # Minimum height in pixels
    shape_idx = 1
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area:
            continue  # Skip small shapes by area
        x, y, w, h = cv2.boundingRect(cnt)
        if w < min_width or h < min_height:
            continue  # Skip shapes that are too thin or small
        # Create mask for this shape
        shape_mask = np.zeros(gray.shape, dtype=np.uint8)
        cv2.drawContours(shape_mask, [cnt], -1, 255, -1)
        # Save shape as regular PNG
        out_path = os.path.join(OUTPUT_DIR, f'shape_{shape_idx}.png')
        save_transparent_png(shape_mask, orig_img, (x, y, w, h), out_path)
        shape_idx += 1
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
