#!/bin/bash

find ./app -name "page.tsx" | while read filename; do
  echo "Fixing $filename"

  # ลบบรรทัดเก่าถ้ามี
  sed -i "/'use client';/d" "$filename"
  sed -i "/export const dynamic = 'force-dynamic';/d" "$filename"

  # แทรกใหม่
  sed -i "1i'use client';\nexport const dynamic = 'force-dynamic';\n" "$filename"

done

echo "✅ All pages fixed with dynamic + use client!"
