import cv2
import numpy as np

# Load the image
image = cv2.imread('infantry_blue.png')

# Convert the image to HSV color space
hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

# Define the color range for green (in HSV)
lower_green = np.array([40, 40, 40])
upper_green = np.array([80, 255, 255])

# Create a mask for green color
mask = cv2.inRange(hsv, lower_green, upper_green)

# Define the target blue color in HSV
# For example, a pure blue color
target_color = np.array([120, 255, 255])

# Apply the mask to replace green with blue
hsv[mask > 0] = target_color

# Convert back to BGR color space
output_image = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

# Save or display the result
cv2.imwrite('blue_unit.png', output_image)
# cv2.imshow('Transformed Image', output_image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()
