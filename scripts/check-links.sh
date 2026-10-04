#!/usr/bin/env bash
# Prints the HTTP status of every supplier link in js/data.js.
# 403/429/503 usually mean the store blocks bots, not that the page is gone.
# Re-check anything that returns 404 or 000 in a real browser.
cd "$(dirname "$0")/.."
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
grep -oE 'https://[^"`]+' js/data.js | grep -v '\${' | sort -u | while read -r url; do
  code=$(curl -s -o /dev/null -L -m 20 -A "$UA" -w "%{http_code}" "$url")
  printf "%s  %s\n" "$code" "$url"
done
