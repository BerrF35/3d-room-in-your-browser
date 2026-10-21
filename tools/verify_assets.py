"""
Asset Integrity & Production Resource Verification Tool
Verifies all authoritative assets, Draco decoders, project evidence images,
and CAD models required for JAIJITESH.OS.
"""

import os
import re

def verify_assets():
    print("=" * 65)
    print("JAIJITESH.OS — PRODUCTION ASSET INTEGRITY AUDIT")
    print("=" * 65)

    critical_assets = [
        ('Main 3D World Model (Draco+WebP)', 'assets/jaijitesh_room.glb'),
        ('Draco WASM Decoder', 'assets/draco/draco_decoder.wasm'),
        ('Draco JS Loader', 'assets/draco/draco_decoder.js'),
        ('Draco WASM Wrapper', 'assets/draco/draco_wasm_wrapper.js'),
        ('Profile Portrait', 'assets/images/profile/portrait_full_body.jpg'),
        ('BerryBot Tracked CAD STEP', 'assets/cad/TV_ensemble complet.STEP'),
        ('Raspberry Pi 4 CAD STEP', 'assets/cad/Raspberry Pi 4 Model B.STEP'),
        ('ESP32 WROOM CAD STEP', 'assets/cad/PCB_ESP32-38Pines.step')
    ]

    all_passed = True
    print("\n[Authoritative Runtime Assets]")
    for label, path in critical_assets:
        if os.path.exists(path):
            size_kb = os.path.getsize(path) / 1024
            if size_kb > 1024:
                size_str = f"{size_kb / 1024:.2f} MB"
            else:
                size_str = f"{size_kb:.1f} KB"
            print(f"  [PASS] {label}: {path} ({size_str})")
        else:
            print(f"  [FAIL] Missing critical asset: {path}")
            all_passed = False

    # Check images referenced in portfolioData.js
    with open('js/portfolioData.js', 'r', encoding='utf-8') as f:
        content = f.read()

    img_paths = set(re.findall(r'[\'\"](assets/images/[^\'\"]+)[\'\"]', content))
    print(f"\n[Portfolio Evidence Images: {len(img_paths)} referenced]")
    missing_imgs = [p for p in img_paths if not os.path.exists(p)]
    if missing_imgs:
        for m in missing_imgs:
            print(f"  [WARN] Missing image: {m}")
    else:
        print(f"  [PASS] All {len(img_paths)} project preview and evidence images exist.")

    # Historical baked models note
    baked_props = [
        'assets/chassis.glb',
        'assets/raspberry.glb',
        'assets/esp32.glb',
        'assets/canon_at-1_retro_camera.glb',
        'assets/full_body_shepherd_dog_meshy.glb',
        'assets/3d_modelling_my_cat_fripouille.glb'
    ]
    print(f"\n[Authoritative Scene Baking Status]")
    print(f"  [NOTE] {len(baked_props)} standalone props are consolidated & baked into assets/jaijitesh_room.glb")
    print(f"         Interactables are resolved via scene graph node traversal (PC_0, cam0001, rpi_L, d1_454_block).")

    print("\n" + "=" * 65)
    if all_passed:
        print("RESULT: ALL REQUIRED RUNTIME ASSETS VALIDATED SUCCESSFULLY.")
        print("=" * 65)
        return 0
    else:
        print("RESULT: MISSING CRITICAL ASSETS DETECTED.")
        print("=" * 65)
        return 1

if __name__ == '__main__':
    exit(verify_assets())
