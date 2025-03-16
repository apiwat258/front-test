#!/bin/bash

find ./app -name "page.tsx" | while read filename; do
  echo "Processing $filename"

  # เช็คว่ามี 'use client'; ไหม
  if ! grep -q "'use client';" "$filename"; then
    sed -i "1i'use client';" "$filename"
  fi

  # เช็คว่ามี export dynamic ไหม
  if ! grep -q "export const dynamic = 'force-dynamic';" "$filename"; then
    sed -i "2iexport const dynamic = 'force-dynamic';" "$filename"
  fi
done

echo "✅ Done adding dynamic and use client!"
