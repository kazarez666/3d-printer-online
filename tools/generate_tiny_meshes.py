import numpy as np
from skimage import measure
import trimesh, os

N=48
BOUNDS=(-3.0,3.0,-0.2,3.2,-2.0,2.0)
xs=np.linspace(BOUNDS[0],BOUNDS[1],N); ys=np.linspace(BOUNDS[2],BOUNDS[3],N); zs=np.linspace(BOUNDS[4],BOUNDS[5],N)
X,Y,Z=np.meshgrid(xs,ys,zs,indexing='ij')

def E(c,r):
    cx,cy,cz=c; rx,ry,rz=r
    return (np.sqrt(((X-cx)/rx)**2+((Y-cy)/ry)**2+((Z-cz)/rz)**2)-1.0)*min(rx,ry,rz)

def C(a,b,r):
    a=np.array(a,float); b=np.array(b,float); ab=b-a; den=float(np.dot(ab,ab))
    px=X-a[0]; py=Y-a[1]; pz=Z-a[2]
    t=np.clip((px*ab[0]+py*ab[1]+pz*ab[2])/den,0,1)
    dx=px-t*ab[0]; dy=py-t*ab[1]; dz=pz-t*ab[2]
    return np.sqrt(dx*dx+dy*dy+dz*dz)-r

def union(parts):
    s=parts[0]
    for p in parts[1:]: s=np.minimum(s,p)
    return s

def chain(points,radii):
    return [C(points[i],points[i+1],(radii[i]+radii[i+1])*.5) for i in range(len(points)-1)]

def mesh_from_sdf(sdf,path):
    verts,faces,_,_=measure.marching_cubes(sdf,level=0.0,spacing=((xs[-1]-xs[0])/(N-1),(ys[-1]-ys[0])/(N-1),(zs[-1]-zs[0])/(N-1)))
    verts[:,0]+=xs[0]; verts[:,1]+=ys[0]; verts[:,2]+=zs[0]
    m=trimesh.Trimesh(vertices=verts,faces=faces,process=True)
    m.remove_unreferenced_vertices(); m.fix_normals()
    try: trimesh.smoothing.filter_taubin(m,lamb=0.35,nu=-0.36,iterations=5)
    except Exception: pass
    os.makedirs(os.path.dirname(path),exist_ok=True)
    m.export(path)
    print(os.path.basename(path),len(m.vertices),len(m.faces),round(os.path.getsize(path)/1024,1),'KB')

def cat(kind):
    slim=kind in ('siamese','bengal'); maine=kind=='maine'; brit=kind=='british'
    body_rx=0.46 if slim else (0.58 if brit else 0.54)
    body_ry=0.48 if slim else (0.58 if maine or brit else 0.52)
    parts=[E((0,1.08,-0.25),(body_rx,body_ry,0.86)),E((0,1.18,0.42),(body_rx*.86,body_ry*.9,0.52)),C((0,1.24,.25),(0,1.55,.58),.22 if slim else .25),E((0,1.68,.78),(.36 if slim else .42,.37 if slim else .42,.36 if slim else .4)),E((-.13,1.58,1.06),(.18,.13,.18)),E((.13,1.58,1.06),(.18,.13,.18)),E((-.22,2.0,.78),(.12,.28,.11)),E((.22,2.0,.78),(.12,.28,.11))]
    leg_r=.075 if slim else .09
    for x in (-.24,.24):
        parts += [C((x,.96,.38),(x,.2,.58),leg_r),E((x,.14,.68),(.14,.08,.21)),C((x,.86,-.62),(x,.2,-.52),leg_r*1.05),E((x,.14,-.4),(.15,.08,.22))]
    pts=[(.18,1.05,-1.0),(.48,1.08,-1.34),(.66,1.42,-1.28),(.58,1.78,-1.0),(.42,1.98,-.7)]
    rr=[.07 if slim else .09]*5
    if maine: rr=[.13,.13,.12,.11,.1]
    parts += chain(pts,rr)
    if maine: parts += [E((0,1.47,.48),(.5,.35,.42))]
    return union(parts)

def duck(ugly=False):
    parts=[E((0,.95,-.18),(.72,.65,.88)),E((0,1.02,.5),(.6,.58,.62)),C((0,1.18,.25),(0,1.46,.68),.23),E((0,1.58,.84),(.43,.42,.42)),E((-.56,1.05,-.02),(.16,.35,.46)),E((.56,1.05,-.02),(.16,.35,.46)),C((0,1.05,-.82),(0,1.25,-1.25),.16),C((-.2,.62,.05),(-.2,.18,.12),.055),C((.2,.62,.05),(.2,.18,.12),.055),E((-.2,.12,.3),(.18,.07,.25)),E((.2,.12,.3),(.18,.07,.25))]
    if ugly: parts += [C((0,1.86,.72),(0,2.05,.62),.07),C((-.08,1.88,.72),(-.16,2.03,.66),.045),C((.08,1.88,.72),(.16,2.03,.66),.045)]
    return union(parts)

def dino(kind):
    parts=[]
    if kind=='trex':
        parts += [E((-.15,1.15,0),(.8,.55,.46)),E((.48,1.32,0),(.48,.42,.36)),C((.25,1.32,0),(.84,1.7,0),.22),E((1.05,1.78,0),(.48,.34,.34)),E((1.42,1.68,0),(.38,.22,.28))]
        parts += chain([(-.72,1.16,0),(-1.3,1.2,0),(-1.9,1.02,0),(-2.45,.72,0)],[.2,.17,.11,.05])
        for x,z in [(-.25,.24),(.18,-.24)]: parts += [E((x,.72,z),(.24,.38,.2)),C((x,.65,z),(x-.08,.12,z),.09),E((x+.12,.08,z),(.25,.07,.12))]
        for z in (-.2,.2): parts += [C((.42,1.35,z),(.72,1.08,z),.045),C((.72,1.08,z),(.82,1.02,z),.026)]
    elif kind=='brachio':
        parts += [E((-.25,1.0,0),(.9,.55,.5)),C((.45,1.12,0),(.72,2.18,0),.18),E((.86,2.36,0),(.28,.2,.2))]
        parts += chain([(-.9,1.0,0),(-1.5,1.05,0),(-2.05,.88,0)],[.15,.1,.04])
        for x in (-.55,.35):
            for z in (-.28,.28): parts += [C((x,.83,z),(x,.12,z),.095),E((x+.08,.08,z),(.19,.06,.11))]
    elif kind=='stego':
        parts += [E((-.15,.98,0),(1.0,.48,.52)),E((.65,1.0,0),(.38,.3,.32))]
        parts += chain([(-.95,.96,0),(-1.5,.9,0),(-1.95,.7,0)],[.12,.08,.04])
        for x in np.linspace(-.7,.55,6): parts += [C((x,1.22,0),(x,1.68,0),.08)]
        for x in (-.55,.35):
            for z in (-.3,.3): parts += [C((x,.75,z),(x,.12,z),.08),E((x+.08,.08,z),(.16,.06,.1))]
    elif kind=='tri':
        parts += [E((-.2,.98,0),(1.0,.48,.55)),E((.78,1.08,0),(.42,.34,.4)),E((.5,1.35,0),(.36,.28,.55))]
        for z in (-.2,.2): parts += [C((.88,1.22,z),(1.35,1.48,z),.055)]
        parts += [C((1.02,1.08,0),(1.35,1.12,0),.04)]
        parts += chain([(-1.0,.96,0),(-1.45,.86,0),(-1.75,.7,0)],[.09,.06,.03])
        for x in (-.55,.35):
            for z in (-.3,.3): parts += [C((x,.75,z),(x,.12,z),.085),E((x+.08,.08,z),(.17,.06,.11))]
    elif kind=='anky':
        parts += [E((-.2,.88,0),(1.0,.42,.6)),E((.72,.9,0),(.34,.28,.34))]
        for x in np.linspace(-.65,.5,6):
            for z in (-.42,.42): parts += [E((x,1.2,z),(.1,.13,.1))]
        parts += chain([(-1.0,.82,0),(-1.45,.72,0),(-1.75,.58,0)],[.12,.1,.08]); parts += [E((-1.95,.54,0),(.28,.18,.23))]
        for x in (-.55,.35):
            for z in (-.33,.33): parts += [C((x,.66,z),(x,.12,z),.08),E((x+.08,.08,z),(.16,.06,.1))]
    elif kind=='spino':
        parts += [E((-.15,1.0,0),(1.0,.48,.45)),E((.72,1.16,0),(.42,.28,.3)),C((.65,1.1,0),(1.25,1.1,0),.17)]
        for x in np.linspace(-.75,.45,7): parts += [C((x,1.2,0),(x,1.95-abs(x+.1)*.25,0),.06)]
        parts += chain([(-1.0,1.0,0),(-1.5,.96,0),(-2.0,.76,0)],[.12,.08,.04])
        for x,z in [(-.35,.2),(.28,-.2)]: parts += [C((x,.7,z),(x,.12,z),.08),E((x+.1,.08,z),(.17,.06,.1))]
    else:
        parts += [E((-.15,1.0,0),(.95,.48,.48)),C((.45,1.1,0),(.78,1.48,0),.15),E((.92,1.58,0),(.3,.24,.28)),C((.88,1.7,0),(.45,2.0,0),.08)]
        parts += chain([(-.95,.98,0),(-1.4,.96,0),(-1.85,.78,0)],[.11,.07,.03])
        for x in (-.5,.32):
            for z in (-.25,.25): parts += [C((x,.72,z),(x,.12,z),.075),E((x+.08,.08,z),(.15,.06,.1))]
    return union(parts)

def generate(out):
    items=[]
    for kind in ['british','siamese','tabby','maine','bengal']: items.append((f'cats_{kind}',cat(kind)))
    for kind in ['para','stego','brachio','tri','anky','spino','trex']: items.append((f'dinos_{kind}',dino(kind)))
    items += [('ducks_yellow',duck(False)),('ducks_ugly',duck(True))]
    for name,sdf in items: mesh_from_sdf(sdf,os.path.join(out,name+'.glb'))

if __name__=='__main__':
    import sys
    generate(sys.argv[1] if len(sys.argv)>1 else 'assets/tiny')
