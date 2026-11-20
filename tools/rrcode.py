#!/usr/bin/env python3
"""Make a River + Rail redeem code.
Usage:
  python3 rrcode.py E 1 4    # exercise, Module 1, grade 4/5  -> 4 packs + signature card (5/5 adds a Premium pack)
  python3 rrcode.py F 2 1    # field mission, Module 2        -> 1 Premium pack
  python3 rrcode.py B 1 2    # bonus, 2 standard packs
"""
import hashlib, secrets, sys
SALT = 'rr-tcg-2026-groundbreaking'
ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
def make(t, mod, val):
    assert t in 'EFB' and 1 <= mod <= 99 and 0 <= val <= 9
    body = f"{t}{mod:02d}{val}" + ''.join(secrets.choice(ALPHA) for _ in range(4))
    h = hashlib.sha256((SALT + body).encode()).digest()
    chk = ''.join(ALPHA[h[i] % len(ALPHA)] for i in range(4))
    return f"RR-{body}-{chk}"
if __name__ == '__main__':
    t, mod, val = sys.argv[1].upper(), int(sys.argv[2]), int(sys.argv[3])
    print(make(t, mod, val))
