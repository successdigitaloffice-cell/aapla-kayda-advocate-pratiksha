"""
Plain Room Photorealistic Advocate Character Animation & Mobile Reel Engine
Project: Aapla Kayda - Advocate Pratiksha

Features:
- Genuine Advocate Pratiksha from Reference Photo: Clear modern acrylic glasses,
  delicate gold nose pin on left nostril, warm Indian skin tone, natural hair.
- Attire: Tailored Black Advocate Blazer Coat, White Collared Shirt, White Advocate Neck Bands.
- Setting: 100% Plain Real Room Wall (soft neutral warm-beige interior wall, natural indoor lighting).
  ZERO bookshelves, ZERO office desks, ZERO gavels, ZERO logos, ZERO top banners.
- Real Human Body & Hand Movement:
  - Pose 1 (Hook/Problem): Right hand raised at chest in an open-palm explanatory legal gesture.
  - Pose 2 (Law Solution/Remedy): Both hands raised at chest in a persuasive courtroom gesture.
  - Organic Lip-Sync: Seamless Gaussian-feathered blending between closed resting mouth and
    articulate open mouth with real teeth, tongue depth, and natural lips.
  - Hand & Finger Dynamics: Hands naturally articulate with speech volume and rhythm.
  - Head Micro-Cadence: Natural micro-nods and speech emphasis.
  - Real Mobile Camera Motion: Subtle handheld camera float + smooth cinematic push-in.
- Clean Modern Instagram Reel Subtitles (minimalist dark translucent pill at lower third).
"""

import os
import sys
import math
import time
import json
import wave
import subprocess
from typing import Dict, List, Optional, Tuple

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

FFMPEG_EXE = imageio_ffmpeg.get_ffmpeg_exe()

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(CURRENT_DIR)
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
FONTS_DIR = os.path.join(ASSETS_DIR, "fonts")
AVATARS_DIR = os.path.join(ASSETS_DIR, "avatars")
os.makedirs(AVATARS_DIR, exist_ok=True)

FONT_BOLD = os.path.join(FONTS_DIR, "Mukta-Bold.ttf")
FONT_REGULAR = os.path.join(FONTS_DIR, "Mukta-Regular.ttf")

# Plain Room Photorealistic Keyframe Pairs
PLAIN_G1_NEU_PATH = os.path.join(AVATARS_DIR, "plain_g1_neu_1080.jpg")
PLAIN_G1_SPK_PATH = os.path.join(AVATARS_DIR, "plain_g1_spk_1080.jpg")
PLAIN_G2_NEU_PATH = os.path.join(AVATARS_DIR, "plain_g2_neu_1080.jpg")
PLAIN_G2_SPK_PATH = os.path.join(AVATARS_DIR, "plain_g2_spk_1080.jpg")
PLAIN_INTRO_PATH   = os.path.join(AVATARS_DIR, "plain_intro_neu_1080.jpg")

MASTER_AVATAR_PATH = PLAIN_G1_NEU_PATH
BACKEND_AVATARS_DIR = r"D:\INSTA SCRIPT AI\backend\data\uploads\avatars"


# ============================================================
# 1. AUDIO ENVELOPE EXTRACTOR (PER-FRAME RMS)
# ============================================================
def extract_frame_amplitudes(audio_path: str, fps: int = 25) -> Tuple[List[float], float]:
    temp_wav = audio_path.replace(".mp3", "_temp.wav")
    if not temp_wav.endswith(".wav"):
        temp_wav += "_temp.wav"

    cmd = [
        FFMPEG_EXE, "-y",
        "-i", audio_path,
        "-ac", "1",
        "-ar", "16000",
        temp_wav
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    try:
        with wave.open(temp_wav, "rb") as wf:
            framerate = wf.getframerate()
            n_frames = wf.getnframes()
            raw_data = wf.readframes(n_frames)

        duration = n_frames / float(framerate)
        samples = np.frombuffer(raw_data, dtype=np.int16).astype(np.float32) / 32768.0

        samples_per_frame = int(framerate / fps)
        total_video_frames = max(1, int(math.ceil(duration * fps)))
        frame_energies = []

        for i in range(total_video_frames):
            start = i * samples_per_frame
            end = min(len(samples), start + samples_per_frame)
            if start >= len(samples):
                frame_energies.append(0.0)
                continue
            chunk = samples[start:end]
            rms = np.sqrt(np.mean(chunk ** 2)) if len(chunk) > 0 else 0.0
            frame_energies.append(float(rms))

        arr = np.array(frame_energies)
        max_val = np.max(arr) if len(arr) > 0 and np.max(arr) > 0 else 1.0
        noise_floor = np.percentile(arr, 15) if len(arr) > 5 else 0.01
        arr = np.clip((arr - noise_floor) / (max_val - noise_floor + 1e-6), 0.0, 1.0)
        smoothed = np.convolve(arr, [0.25, 0.50, 0.25], mode="same")
        return smoothed.tolist(), duration
    finally:
        if os.path.exists(temp_wav):
            try:
                os.remove(temp_wav)
            except Exception:
                pass


# ============================================================
# 2. SLEEK INSTAGRAM REEL SUBTITLE OVERLAY (NO CLUTTER)
# ============================================================
def render_reel_subtitles_overlay(scene_text: str, out_png_path: str) -> str:
    """
    Renders clean, modern, minimalist Instagram Reel captions
    at the lower third. No logos, no header cards, no clutter.
    """
    w, h = 1080, 1920
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    f_caption = ImageFont.truetype(FONT_BOLD, 38) if os.path.exists(FONT_BOLD) else None

    # Break text into short, readable lines (max 28 characters per line)
    words = scene_text.replace("\n", " ").split(" ")
    lines = []
    curr = ""
    for wrd in words:
        if len(curr) + len(wrd) + 1 <= 28:
            curr = f"{curr} {wrd}".strip()
        else:
            lines.append(curr)
            curr = wrd
    if curr:
        lines.append(curr)
    display_lines = lines[:3]

    if display_lines:
        line_height = 54
        pad_y = 24
        pad_x = 36
        total_text_h = len(display_lines) * line_height

        # Position at lower third (y: 1540..1720)
        box_y1 = h - 380 - total_text_h
        box_y2 = box_y1 + total_text_h + pad_y * 2

        # Calculate max line width
        max_lw = 0
        for l in display_lines:
            if f_caption:
                bbox = draw.textbbox((0, 0), l, font=f_caption)
                lw = bbox[2] - bbox[0]
            else:
                lw = len(l) * 22
            max_lw = max(max_lw, lw)

        box_w = min(w - 96, max_lw + pad_x * 2)
        box_x1 = (w - box_w) // 2
        box_x2 = box_x1 + box_w

        # Modern frosted glass pill
        draw.rounded_rectangle(
            [(box_x1, box_y1), (box_x2, box_y2)],
            radius=20,
            fill=(10, 15, 25, 205),
            outline=(255, 215, 0, 180),
            width=2
        )

        curr_y = box_y1 + pad_y
        for l in display_lines:
            if f_caption:
                bbox = draw.textbbox((0, 0), l, font=f_caption)
                lw = bbox[2] - bbox[0]
            else:
                lw = len(l) * 22
            tx = (w - lw) // 2
            # Text shadow for maximum clarity
            draw.text((tx + 2, curr_y + 2), l, fill=(0, 0, 0, 230), font=f_caption)
            draw.text((tx, curr_y), l, fill=(255, 255, 255, 255), font=f_caption)
            curr_y += line_height

    img.save(out_png_path, "PNG")
    return out_png_path


# ============================================================
# 3. REALISTIC PLAIN ROOM ADVOCATE AVATAR SYNTHESIZER
# ============================================================
class PlainRoomAdvocateAvatarSynthesizer:
    """
    Renders Advocate Pratiksha in an authentic, natural mobile camera reel format:
    - 100% Plain real room wall (no office desks, no law books, no fake clutter).
    - Multi-angle / multi-gesture states (single-hand explanatory gesture vs. two-handed persuasive gesture).
    - Seamless audio RMS mouth articulation with real teeth and lips.
    - Hand & finger dynamics matching speaking rhythm.
    - Handheld mobile camera float and push-in zoom.
    """
    def __init__(self, avatar_path: Optional[str] = None):
        # Load Pose 1 (Single Hand Raised - Explanatory)
        self.g1_neu = cv2.imread(PLAIN_G1_NEU_PATH)
        self.g1_spk = cv2.imread(PLAIN_G1_SPK_PATH)

        # Load Pose 2 (Two Hands Raised - Emphatic Solution)
        self.g2_neu = cv2.imread(PLAIN_G2_NEU_PATH)
        self.g2_spk = cv2.imread(PLAIN_G2_SPK_PATH)

        # Mouth geometry (calibrated on 1080x1920)
        self.cx, self.cy = 540, 810
        self.rw, self.rh = 95, 60
        self.mx1, self.mx2 = self.cx - self.rw, self.cx + self.rw  # 445..635
        self.my1, self.my2 = self.cy - self.rh, self.cy + self.rh  # 750..870

        # Pre-compute Gaussian feathered mask
        mask = np.zeros((self.my2 - self.my1, self.mx2 - self.mx1), dtype=np.float32)
        cv2.ellipse(mask, (self.rw, self.rh), (int(self.rw * 0.75), int(self.rh * 0.70)), 0, 0, 360, 1.0, -1)
        self.mouth_mask = cv2.GaussianBlur(mask, (21, 21), 0)[:, :, np.newaxis]

        # Pre-extract mouth patches
        self.g1_patch_neu = self.g1_neu[self.my1:self.my2, self.mx1:self.mx2].astype(np.float32)
        self.g1_patch_spk = self.g1_spk[self.my1:self.my2, self.mx1:self.mx2].astype(np.float32)

        self.g2_patch_neu = self.g2_neu[self.my1:self.my2, self.mx1:self.mx2].astype(np.float32)
        self.g2_patch_spk = self.g2_spk[self.my1:self.my2, self.mx1:self.mx2].astype(np.float32)

    def generate_plain_room_frame(
        self,
        amp: float,
        frame_idx: int,
        total_frames: int,
        pose_key: str = "g1"
    ) -> np.ndarray:
        """
        Generates a photorealistic mobile camera reel frame:
        - Organic speech articulation (blends closed resting mouth & open speaking teeth)
        - Hand & finger dynamics (articulate with speech energy)
        - Head micro-cadence (micro-nods & breathing)
        - Handheld mobile camera float & push-in zoom
        """
        if pose_key == "g2":
            base_frame = self.g2_neu.copy()
            patch_neu = self.g2_patch_neu
            patch_spk = self.g2_patch_spk
        else:
            base_frame = self.g1_neu.copy()
            patch_neu = self.g1_patch_neu
            patch_spk = self.g1_patch_spk

        # 1. Organic Mouth Articulation
        if amp > 0.03:
            weight = math.pow(amp, 0.85)
            blended_mouth = weight * patch_spk + (1.0 - weight) * patch_neu
            base_frame[self.my1:self.my2, self.mx1:self.mx2] = (
                self.mouth_mask * blended_mouth + (1.0 - self.mouth_mask) * patch_neu
            ).astype(np.uint8)

        # 2. Hand & Arm Motion Dynamics
        # When actively speaking, hands articulate with natural human rhythm
        if amp > 0.12:
            if pose_key == "g1":
                # Right hand ROI: x=220..490, y=1100..1600
                hx1, hx2, hy1, hy2 = 220, 490, 1100, 1600
                hand_roi = base_frame[hy1:hy2, hx1:hx2].copy()
                hr_h, hr_w = hand_roi.shape[:2]

                lift_y = int(math.sin(frame_idx * 0.20) * amp * 7.0)
                tilt_a = math.cos(frame_idx * 0.16) * amp * 2.5

                M_hand = cv2.getRotationMatrix2D((hr_w // 2, hr_h // 2), tilt_a, 1.0)
                M_hand[1, 2] -= lift_y
                anim_hand = cv2.warpAffine(hand_roi, M_hand, (hr_w, hr_h), borderMode=cv2.BORDER_REFLECT)

                mask_hand = np.zeros((hr_h, hr_w), dtype=np.float32)
                cv2.ellipse(mask_hand, (hr_w // 2, hr_h // 2), (int(hr_w * 0.44), int(hr_h * 0.44)), 0, 0, 360, 1.0, -1)
                mask_hand = cv2.GaussianBlur(mask_hand, (15, 15), 0)[:, :, np.newaxis]

                base_frame[hy1:hy2, hx1:hx2] = (
                    mask_hand * anim_hand + (1.0 - mask_hand) * hand_roi.astype(float)
                ).astype(np.uint8)

            elif pose_key == "g2":
                # Both hands ROI: x=210..870, y=1100..1650
                hx1, hx2, hy1, hy2 = 210, 870, 1100, 1650
                hand_roi = base_frame[hy1:hy2, hx1:hx2].copy()
                hr_h, hr_w = hand_roi.shape[:2]

                lift_y = int(math.sin(frame_idx * 0.22) * amp * 6.0)
                M_hand = np.float32([[1, 0, 0], [0, 1, -lift_y]])
                anim_hand = cv2.warpAffine(hand_roi, M_hand, (hr_w, hr_h), borderMode=cv2.BORDER_REFLECT)

                mask_hand = np.zeros((hr_h, hr_w), dtype=np.float32)
                cv2.ellipse(mask_hand, (hr_w // 2, hr_h // 2), (int(hr_w * 0.46), int(hr_h * 0.44)), 0, 0, 360, 1.0, -1)
                mask_hand = cv2.GaussianBlur(mask_hand, (15, 15), 0)[:, :, np.newaxis]

                base_frame[hy1:hy2, hx1:hx2] = (
                    mask_hand * anim_hand + (1.0 - mask_hand) * hand_roi.astype(float)
                ).astype(np.uint8)

        # 3. Head & Upper Body Micro-Cadence (Sinusoidal Breathing + Speaking Nod)
        dy = int(math.sin(frame_idx * 0.12) * 1.5 + math.sin(frame_idx * 0.28) * amp * 3.0)
        dx = int(math.cos(frame_idx * 0.14) * 1.2)

        if dy != 0 or dx != 0:
            M_body = np.float32([[1, 0, dx], [0, 1, dy]])
            base_frame = cv2.warpAffine(base_frame, M_body, (1080, 1920), borderMode=cv2.BORDER_REFLECT)

        # 4. Authentic Handheld Mobile Camera Float
        # Natural subtle 1-2px organic handheld drift
        cam_dx = math.sin(frame_idx * 0.08) * 1.5 + math.cos(frame_idx * 0.03) * 1.0
        cam_dy = math.cos(frame_idx * 0.07) * 1.2 + math.sin(frame_idx * 0.04) * 0.8
        M_cam = np.float32([[1, 0, cam_dx], [0, 1, cam_dy]])
        base_frame = cv2.warpAffine(base_frame, M_cam, (1080, 1920), borderMode=cv2.BORDER_REFLECT)

        # 5. Smooth Cinematic Push-In Zoom (1.000x to 1.025x)
        zoom = 1.0 + (frame_idx / float(max(1, total_frames))) * 0.025
        if zoom > 1.001:
            zw = int(1080 / zoom)
            zh = int(1920 / zoom)
            zx = (1080 - zw) // 2
            zy = (1920 - zh) // 3  # Center zoom toward face
            crop = base_frame[zy:zy+zh, zx:zx+zw]
            base_frame = cv2.resize(crop, (1080, 1920), interpolation=cv2.INTER_LINEAR)

        return base_frame

    def render_talking_avatar_clip(
        self,
        audio_path: str,
        scene_text: str,
        scene_badge: str,
        output_mp4: str,
        fps: int = 25,
        pose_key: str = "g1"
    ) -> str:
        """
        Renders a full 1080x1920 mobile reel clip for this scene.
        """
        amplitudes, duration = extract_frame_amplitudes(audio_path, fps=fps)
        total_frames = len(amplitudes)
        target_w, target_h = 1080, 1920

        # Pre-render clean modern subtitles overlay
        overlay_temp_png = output_mp4.replace(".mp4", "_sub_overlay.png")
        try:
            render_reel_subtitles_overlay(scene_text, overlay_temp_png)
            overlay_bgra = cv2.imread(overlay_temp_png, cv2.IMREAD_UNCHANGED)
            if overlay_bgra is not None and overlay_bgra.shape[2] == 4:
                alpha = (overlay_bgra[:, :, 3].astype(np.float32) / 255.0)[:, :, np.newaxis]
                overlay_bgr = overlay_bgra[:, :, :3]
            else:
                alpha, overlay_bgr = None, None
        except Exception as oe:
            print(f"[Sub Overlay Warning] {oe}")
            alpha, overlay_bgr = None, None

        cmd = [
            FFMPEG_EXE, "-y",
            "-f", "rawvideo",
            "-vcodec", "rawvideo",
            "-s", f"{target_w}x{target_h}",
            "-pix_fmt", "bgr24",
            "-r", str(fps),
            "-i", "-",
            "-i", audio_path,
            "-c:v", "libx264",
            "-preset", "veryfast",
            "-pix_fmt", "yuv420p",
            "-c:a", "aac",
            "-b:a", "192k",
            "-shortest",
            output_mp4
        ]

        proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        try:
            for i in range(total_frames):
                amp = amplitudes[i]
                anim_bgr = self.generate_plain_room_frame(
                    amp=amp,
                    frame_idx=i,
                    total_frames=total_frames,
                    pose_key=pose_key
                )

                # Composite clean subtitles
                if alpha is not None and overlay_bgr is not None:
                    final_bgr = (alpha * overlay_bgr + (1.0 - alpha) * anim_bgr).astype(np.uint8)
                else:
                    final_bgr = anim_bgr

                proc.stdin.write(final_bgr.tobytes())

            proc.stdin.close()
            proc.wait()
            return output_mp4
        except Exception as e:
            if proc.stdin:
                try:
                    proc.stdin.close()
                except Exception:
                    pass
            proc.kill()
            raise e
        finally:
            if os.path.exists(overlay_temp_png):
                try:
                    os.remove(overlay_temp_png)
                except Exception:
                    pass


# Compatibility Aliases
FullAdvocateAvatarSynthesizer = PlainRoomAdvocateAvatarSynthesizer
TalkingAvatarSynthesizer = PlainRoomAdvocateAvatarSynthesizer


# ============================================================
# 4. MASTER COMPOSITOR FOR MULTI-ANGLE TALKING AVATAR REEL
# ============================================================
def render_advocate_talking_reel(
    scenes_with_audio: List[dict],
    avatar_path: str,
    bg_music_preset: str,
    output_dir: str
) -> Tuple[str, List[dict]]:
    """
    Renders multi-angle talking advocate reel in a plain room:
    - Scene 1 (Hook): Single-hand raised explanatory gesture (G1)
    - Scene 2 (Problem): Close-Up push-in on G1
    - Scene 3 (Solution): Two-handed persuasive legal gesture (G2)
    - Scene 4 (CTA): Concluding legal guidance
    """
    clips_dir = os.path.join(output_dir, "clips")
    os.makedirs(clips_dir, exist_ok=True)

    synth = PlainRoomAdvocateAvatarSynthesizer(avatar_path=avatar_path)

    clip_paths = []
    clip_meta = []

    # Map scene roles to distinct physical poses
    pose_schedule = {
        0: "g1",  # Scene 1: Hook with right hand raised explaining
        1: "g1",  # Scene 2: Problem explanation
        2: "g2",  # Scene 3: Solution with both hands raised persuasively
        3: "g2"   # Scene 4: Final legal advice & Call To Action
    }

    for idx, sc in enumerate(scenes_with_audio):
        s_num = sc.get("scene_num", idx + 1)
        audio_file = sc.get("audio_file")
        text = sc.get("text", "")
        pose = pose_schedule.get(idx, "g1")

        out_clip_name = f"clip_{s_num:02d}.mp4"
        out_clip_path = os.path.join(clips_dir, out_clip_name)

        print(f"[Plain Room Avatar Engine] Rendering Scene #{s_num} (Pose: {pose}) -> {out_clip_name}...")
        synth.render_talking_avatar_clip(
            audio_path=audio_file,
            scene_text=text,
            scene_badge="",
            output_mp4=out_clip_path,
            fps=25,
            pose_key=pose
        )

        clip_paths.append(out_clip_path)
        clip_meta.append({
            "scene_num": s_num,
            "title": text[:40],
            "text": text,
            "clip_file": out_clip_name,
            "duration": sc.get("duration", 5.0)
        })

    # Combine clips
    concat_list_path = os.path.join(output_dir, "concat_clips.txt")
    with open(concat_list_path, "w", encoding="utf-8") as f:
        for cp in clip_paths:
            safe_p = cp.replace("\\", "/")
            f.write(f"file '{safe_p}'\n")

    final_reel_path = os.path.join(output_dir, "final_reel.mp4")

    # Background music
    bg_music_file = None
    if bg_music_preset != "none":
        bg_audio_dir = os.path.join(BASE_DIR, "assets", "bg_audio")
        preset_file = os.path.join(bg_audio_dir, f"{bg_music_preset}.mp3")
        if os.path.exists(preset_file):
            bg_music_file = preset_file

    if bg_music_file:
        cmd = [
            FFMPEG_EXE, "-y",
            "-f", "concat", "-safe", "0", "-i", concat_list_path,
            "-stream_loop", "-1", "-i", bg_music_file,
            "-filter_complex",
            "[1:a]volume=0.10[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=2[aout]",
            "-map", "0:v",
            "-map", "[aout]",
            "-c:v", "copy",
            "-c:a", "aac",
            "-b:a", "192k",
            "-movflags", "+faststart",
            final_reel_path
        ]
    else:
        cmd = [
            FFMPEG_EXE, "-y",
            "-f", "concat", "-safe", "0", "-i", concat_list_path,
            "-c", "copy",
            "-movflags", "+faststart",
            final_reel_path
        ]

    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Inspection thumbnail
    thumb_path = os.path.join(output_dir, "thumbnail.jpg")
    thumb_cmd = [
        FFMPEG_EXE, "-y",
        "-ss", "00:00:02",
        "-i", final_reel_path,
        "-vframes", "1",
        "-q:v", "2",
        thumb_path
    ]
    subprocess.run(thumb_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    return final_reel_path, clip_meta
