import sys
try:
    from PIL import Image, ImageDraw, ImageFilter
    print("PIL OK", Image.__version__)
except Exception as e:
    print("PIL missing", e)
