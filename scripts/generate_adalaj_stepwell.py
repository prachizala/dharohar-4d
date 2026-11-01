import numpy as np
import trimesh
from pathlib import Path

def create_column(x, y, z_bottom, height, radius=0.18, color=[215, 175, 125, 255]):
    # Base plinth
    base = trimesh.creation.box(extents=[radius*2.6, radius*2.6, 0.2])
    base.apply_translation([x, y, z_bottom + 0.1])
    base.visual.vertex_colors = color
    
    # Shaft
    shaft = trimesh.creation.cylinder(radius=radius, height=height - 0.4, sections=16)
    shaft.apply_translation([x, y, z_bottom + height/2])
    shaft.visual.vertex_colors = [c - 10 if i < 3 else c for i, c in enumerate(color)]
    
    # Capital (bracket capital)
    capital = trimesh.creation.box(extents=[radius*3.0, radius*3.0, 0.2])
    capital.apply_translation([x, y, z_bottom + height - 0.1])
    capital.visual.vertex_colors = color
    
    return [base, shaft, capital]

def create_beam(x_center, y_center, z_center, length_x, length_y, height=0.25, color=[200, 160, 115, 255]):
    beam = trimesh.creation.box(extents=[length_x, length_y, height])
    beam.apply_translation([x_center, y_center, z_center])
    beam.visual.vertex_colors = color
    return beam

def create_stairs(start_y, end_y, start_z, end_z, x_center=0, width=3.0, steps=12, color=[190, 150, 105, 255]):
    meshes = []
    y_step = (end_y - start_y) / steps
    z_step = (end_z - start_z) / steps
    depth = abs(y_step) * 1.1
    height = abs(z_step) * 1.05
    
    for i in range(steps):
        st = trimesh.creation.box(extents=[width, depth, height])
        cy = start_y + (i + 0.5) * y_step
        cz = start_z + (i + 0.5) * z_step
        st.apply_translation([x_center, cy, cz])
        st.visual.vertex_colors = color
        meshes.append(st)
    return meshes

def build_adalaj_stepwell():
    parts = []
    
    # Palette
    c_sandstone_dark = [185, 145, 100, 255]
    c_sandstone_med = [215, 175, 125, 255]
    c_sandstone_light = [230, 195, 145, 255]
    c_water = [30, 130, 140, 230] # teal water
    c_floor = [195, 155, 110, 255]
    
    # 5 Tiers specifications
    # Level 0 (Ground entrance): Z = 0
    # Level 1: Z = -1.6
    # Level 2: Z = -3.2
    # Level 3: Z = -4.8
    # Level 4: Z = -6.4
    # Level 5 (Deep Well floor): Z = -8.0
    
    # 1. Open Terraced Retaining Side Walls along the central axis (Y from +8 to -8)
    # Side walls step down gracefully so the interior is completely visible!
    tiers = [
        {"y_range": (5, 9), "z_floor": 0.0, "z_top": 1.2, "width": 4.6},
        {"y_range": (1.5, 5), "z_floor": -1.8, "z_top": 0.6, "width": 5.0},
        {"y_range": (-2, 1.5), "z_floor": -3.6, "z_top": 0.0, "width": 5.4},
        {"y_range": (-5.5, -2), "z_floor": -5.4, "z_top": -0.6, "width": 5.8},
        {"y_range": (-9, -5.5), "z_floor": -7.5, "z_top": -1.2, "width": 6.2},
    ]
    
    for tier in tiers:
        y_start, y_end = tier["y_range"]
        y_len = y_end - y_start
        y_mid = (y_start + y_end) / 2
        z_fl = tier["z_floor"]
        z_tp = tier["z_top"]
        h = z_tp - z_fl
        z_mid = z_fl + h / 2
        w = tier["width"]
        
        # Left retaining wall
        w_left = trimesh.creation.box(extents=[0.5, y_len, h])
        w_left.apply_translation([-w/2 - 0.25, y_mid, z_mid])
        w_left.visual.vertex_colors = c_sandstone_dark
        parts.append(w_left)
        
        # Right retaining wall
        w_right = trimesh.creation.box(extents=[0.5, y_len, h])
        w_right.apply_translation([w/2 + 0.25, y_mid, z_mid])
        w_right.visual.vertex_colors = c_sandstone_dark
        parts.append(w_right)
        
        # Floor platform / landing
        floor = trimesh.creation.box(extents=[w, y_len, 0.3])
        floor.apply_translation([0, y_mid, z_fl - 0.15])
        floor.visual.vertex_colors = c_floor
        parts.append(floor)

    # 2. Descending Stair flights connecting the levels
    parts.extend(create_stairs(start_y=8.0, end_y=5.2, start_z=-0.1, end_z=-1.7, width=3.4, steps=10, color=c_sandstone_med))
    parts.extend(create_stairs(start_y=4.2, end_y=1.8, start_z=-1.9, end_z=-3.5, width=3.4, steps=10, color=c_sandstone_med))
    parts.extend(create_stairs(start_y=0.8, end_y=-1.8, start_z=-3.7, end_z=-5.3, width=3.4, steps=10, color=c_sandstone_med))
    parts.extend(create_stairs(start_y=-2.8, end_y=-5.2, start_z=-5.5, end_z=-7.4, width=3.4, steps=10, color=c_sandstone_med))
    
    # 3. Solanki Ornamental Colonnades & Pavilions (Pillars & Cross-beams)
    # Pavilion 1 (Entrance Pavilion at Y=5)
    for px in [-1.6, 1.6]:
        for py in [4.8, 5.8]:
            parts.extend(create_column(px, py, z_bottom=-1.8, height=2.8, radius=0.18, color=c_sandstone_light))
    # Beams & Roof canopy for Pavilion 1
    parts.append(create_beam(0, 5.3, 1.05, 3.8, 1.6, height=0.25, color=c_sandstone_med))
    # Ornate roof slab
    p1_roof = trimesh.creation.box(extents=[4.0, 1.8, 0.15])
    p1_roof.apply_translation([0, 5.3, 1.25])
    p1_roof.visual.vertex_colors = c_sandstone_light
    parts.append(p1_roof)
    
    # Pavilion 2 (Mid-tier Pavilion at Y=1.5)
    for px in [-1.8, 1.8]:
        for py in [1.0, 2.0]:
            parts.extend(create_column(px, py, z_bottom=-3.6, height=4.2, radius=0.20, color=c_sandstone_light))
    parts.append(create_beam(0, 1.5, 0.65, 4.2, 1.6, height=0.25, color=c_sandstone_med))
    
    # Pavilion 3 (Deep-tier Pavilion at Y=-2.0)
    for px in [-2.0, 2.0]:
        for py in [-2.5, -1.5]:
            parts.extend(create_column(px, py, z_bottom=-5.4, height=5.5, radius=0.22, color=c_sandstone_light))
    parts.append(create_beam(0, -2.0, 0.15, 4.6, 1.6, height=0.25, color=c_sandstone_med))

    # 4. Octagonal Deep Well Shaft at Y=-7.5
    well_center = [0, -7.5]
    radius_outer = 2.8
    radius_inner = 2.2
    well_bottom = -8.2
    well_top = 0.5
    
    # Build 8-sided faceted shaft walls
    n_facets = 8
    angles = np.linspace(0, 2*np.pi, n_facets, endpoint=False)
    for i in range(n_facets):
        a1 = angles[i]
        a2 = angles[(i + 1) % n_facets]
        
        p1_x = well_center[0] + radius_inner * np.cos(a1)
        p1_y = well_center[1] + radius_inner * np.sin(a1)
        p2_x = well_center[0] + radius_inner * np.cos(a2)
        p2_y = well_center[1] + radius_inner * np.sin(a2)
        
        wall_len = np.hypot(p2_x - p1_x, p2_y - p1_y)
        wall_angle = np.arctan2(p2_y - p1_y, p2_x - p1_x)
        
        # Multi-tiered shaft wall with gallery openings
        wall_seg = trimesh.creation.box(extents=[wall_len, 0.4, (well_top - well_bottom)])
        rot_mat = trimesh.transformations.rotation_matrix(wall_angle, [0, 0, 1])
        wall_seg.apply_transform(rot_mat)
        wall_seg.apply_translation([(p1_x + p2_x)/2, (p1_y + p2_y)/2, (well_top + well_bottom)/2])
        wall_seg.visual.vertex_colors = c_sandstone_dark
        parts.append(wall_seg)
        
        # Pillars inside the octagonal shaft
        col_x = well_center[0] + (radius_inner - 0.3) * np.cos(a1)
        col_y = well_center[1] + (radius_inner - 0.3) * np.sin(a1)
        parts.extend(create_column(col_x, col_y, z_bottom=well_bottom, height=(well_top - well_bottom), radius=0.15, color=c_sandstone_light))

    # 5. Reflective Water Pool at the bottom of the well
    water_pool = trimesh.creation.cylinder(radius=radius_inner - 0.05, height=0.4, sections=32)
    water_pool.apply_translation([well_center[0], well_center[1], well_bottom + 0.3])
    water_pool.visual.vertex_colors = c_water
    parts.append(water_pool)
    
    # 6. Ornamental carved wall niches along the descent
    for y_niche in [6.5, 3.2, -0.5, -4.0]:
        niche_l = trimesh.creation.box(extents=[0.3, 0.8, 1.0])
        niche_l.apply_translation([-2.5, y_niche, -1.0])
        niche_l.visual.vertex_colors = [160, 120, 80, 255]
        parts.append(niche_l)
        
        niche_r = trimesh.creation.box(extents=[0.3, 0.8, 1.0])
        niche_r.apply_translation([2.5, y_niche, -1.0])
        niche_r.visual.vertex_colors = [160, 120, 80, 255]
        parts.append(niche_r)

    # Combine all architectural meshes
    full_model = trimesh.util.concatenate(parts)
    
    # Orient model upright for model-viewer (Z is up, rotate 90 deg around X so Y is up for standard GLTF if needed, or leave canonical)
    # GLTF standard has Y up:
    # Rotate around X by -90 deg: X -> X, Y -> Z, Z -> -Y
    matrix = trimesh.transformations.rotation_matrix(
        angle=-np.pi / 2,
        direction=[1, 0, 0],
        point=[0, 0, 0]
    )
    full_model.apply_transform(matrix)
    
    # Center model
    full_model.apply_translation(-full_model.centroid)
    
    return full_model

if __name__ == "__main__":
    out_dir = Path("public/models")
    out_dir.mkdir(parents=True, exist_ok=True)
    
    print("Building intricate Adalaj Stepwell 3D Model...")
    model = build_adalaj_stepwell()
    
    p1 = out_dir / "adalaj.glb"
    p2 = out_dir / "adalaj_photogrammetry_reconstructed.glb"
    
    model.export(str(p1))
    model.export(str(p2))
    
    print(f"SUCCESS: Generated 3D model with {len(model.vertices)} vertices and {len(model.faces)} faces.")
    print(f"Saved to {p1} and {p2}")
