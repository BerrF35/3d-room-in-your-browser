import struct
import json
import os

path = 'assets/jaijitesh_room.glb'
size = os.path.getsize(path)
print(f'Total GLB size: {size / (1024*1024):.2f} MB')

with open(path, 'rb') as f:
    magic, version, length = struct.unpack('<4sII', f.read(12))
    assert magic == b'glTF', f'Invalid magic: {magic}'
    chunk_len, chunk_type = struct.unpack('<II', f.read(8))
    json_bytes = f.read(chunk_len)
    gltf = json.loads(json_bytes.decode('utf-8'))

print(f'Generator: {gltf.get("asset", {}).get("generator")}')
print(f'Meshes: {len(gltf.get("meshes", []))}')
print(f'Materials: {len(gltf.get("materials", []))}')
print(f'Textures: {len(gltf.get("textures", []))}')
print(f'Images: {len(gltf.get("images", []))}')
print(f'Accessors: {len(gltf.get("accessors", []))}')
print(f'BufferViews: {len(gltf.get("bufferViews", []))}')

images = gltf.get('images', [])
buffer_views = gltf.get('bufferViews', [])

img_sizes = []
for i, img in enumerate(images):
    name = img.get('name', f'image_{i}')
    mime = img.get('mimeType', 'unknown')
    bv_idx = img.get('bufferView')
    if bv_idx is not None and bv_idx < len(buffer_views):
        byte_len = buffer_views[bv_idx].get('byteLength', 0)
        img_sizes.append((name, mime, byte_len))

img_sizes.sort(key=lambda x: x[2], reverse=True)
total_img_size = sum(x[2] for x in img_sizes)
print(f'\nTotal embedded image bytes: {total_img_size / (1024*1024):.2f} MB ({total_img_size / size * 100:.1f}% of GLB)')
print('\nTop 20 largest embedded images:')
for name, mime, blen in img_sizes[:20]:
    print(f'  {name:40s} | {mime:12s} | {blen / (1024*1024):6.2f} MB ({blen:10d} bytes)')

# Geometry size: non-image bufferViews
geom_bytes = 0
for i, bv in enumerate(buffer_views):
    if not any(img.get('bufferView') == i for img in images):
        geom_bytes += bv.get('byteLength', 0)
print(f'\nGeometry & animation buffer bytes: {geom_bytes / (1024*1024):.2f} MB ({geom_bytes / size * 100:.1f}% of GLB)')
