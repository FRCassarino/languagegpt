from PIL import Image
import os

# specify directory containing images
directory = '.'

# loop through each image in the directory
for filename in os.listdir(directory):
    if filename.endswith('.png'):
        # open image
        img = Image.open(f"{directory}/{filename}")
        # calculate new height based on aspect ratio
        new_height = int(img.height * 250 / img.width)
        # resize image
        img = img.resize((250, new_height),  Image.Resampling.LANCZOS)
        # save resized image with same filename
        img.save(f"{directory}/{filename}", quality=60)

