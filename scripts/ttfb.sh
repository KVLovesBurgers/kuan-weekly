#!/usr/bin/env bash
# usage: scripts/ttfb.sh [n]  — wait = TTFB minus TCP+TLS setup (server + edge time)
n=${1:-4}
for p in / /practice /sample /privacy /robots.txt; do
  for i in $(seq 1 $n); do
    curl -s -o /dev/null -D /tmp/ttfb_h.txt -w "%{time_appconnect} %{time_starttransfer}\n" "https://kuan-weekly.vercel.app$p?nocache=$RANDOM" > /tmp/ttfb_t.txt
    read a s < /tmp/ttfb_t.txt
    c=$(rg -i "^x-vercel-cache" /tmp/ttfb_h.txt | awk '{print $2}' | tr -d '\r'); id=$(rg -i "^x-vercel-id" /tmp/ttfb_h.txt | awk '{print $2}' | cut -d: -f1-3 | tr -d '\r')
    awk -v p="$p" -v i=$i -v a=$a -v s=$s -v c="$c" -v id="$id" 'BEGIN{printf "%-12s #%d ttfb=%.3f wait=%.3f cache=%s %s\n",p,i,s,s-a,c,id}'
  done
done
