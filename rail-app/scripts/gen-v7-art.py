from PIL import Image, ImageFilter
import numpy as np, os

def smooth_bg(w,h,light_xy,light_color,base,cool,strength=1.0,out=None):
    yy,xx=np.mgrid[0:h,0:w].astype(np.float32)
    lx,ly=light_xy
    d2=((xx-lx*w)**2+(yy-ly*h)**2)/(w*w)
    bloom=np.exp(-d2*2.6)
    vert=(yy/h)[...,None]
    img=(np.array(base,float)[None,None,:]
         + (np.array(light_color,float)-np.array(base,float))[None,None,:]*bloom[...,None]*strength
         + (np.array(cool,float)-np.array(base,float))[None,None,:]*vert*0.35)
    img=np.clip(img,0,255).astype(np.uint8)
    im=Image.fromarray(img,"RGB").filter(ImageFilter.GaussianBlur(18))
    im.save(out,quality=92,method=6)
    print(out, im.size)

smooth_bg(2400,1400,(0.18,0.10),(255,251,244),(247,246,243),(234,231,225),0.95,"public/art/v7/hero-light.webp")
smooth_bg(2000,1400,(0.62,0.28),(255,252,247),(247,246,243),(231,229,224),0.9,"public/art/v7/product-light.webp")
