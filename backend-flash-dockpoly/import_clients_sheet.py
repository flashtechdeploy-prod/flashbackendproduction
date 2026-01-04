import argparse
import csv
import io
import json
import re
from typing import Any

import httpx


def _extract_sheet_key(row: dict[str, Any]) -> str | None:
    for k in row.keys():
        if "List of Client" in k:
            return k
    return None


def _row_to_line(row: dict[str, Any], key: str) -> str:
    parts: list[str] = []
    v0 = row.get(key)
    if isinstance(v0, str) and v0.strip():
        parts.append(v0.strip())

    for i in range(2, 145):
        v = row.get(f"FIELD{i}")
        if not isinstance(v, str):
            continue
        s = v.strip()
        if s:
            parts.append(s)

    line = " ".join(parts)
    line = re.sub(r"\s+", " ", line).strip()
    return line


def _parse_sr_and_name(line: str) -> tuple[str | None, str | None]:
    if not line:
        return None, None

    try:
        cols = next(csv.reader(io.StringIO(line), quotechar='"', skipinitialspace=True))
        if len(cols) >= 2:
            sr = (cols[0] or "").strip()
            name = (cols[1] or "").strip()
            if sr and name:
                return sr, name
    except Exception:
        pass

    m = re.match(r"^\s*(\d+)\s*,\s*(.+?)\s*$", line)
    if not m:
        return None, None
    sr = m.group(1).strip()
    name = m.group(2).strip().strip('"')
    return (sr or None), (name or None)


def _normalize_name(name: str) -> str:
    s = re.sub(r"\s+", " ", name).strip()
    s = s.strip('"').strip()
    s = re.sub(r"\s+,", ",", s)
    s = re.sub(r",\s+", ", ", s)
    return s


def _split_multi_entries(line: str) -> list[tuple[str, str]]:
    if not line:
        return []

    matches = list(re.finditer(r"(?:(?<=^)|(?<=\s))(\d+)\s*,", line))
    if not matches:
        sr, name = _parse_sr_and_name(line)
        return [(sr, name)] if sr and name else []

    out: list[tuple[str, str]] = []
    for i, m in enumerate(matches):
        start = m.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(line)
        seg = line[start:end].strip().strip(",")
        sr, name = _parse_sr_and_name(seg)
        if sr and name:
            out.append((sr, name))
    return out


def parse_sheet_json(path: str) -> list[dict[str, str]]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("Expected a JSON array")

    out: list[dict[str, str]] = []
    for row in data:
        if not isinstance(row, dict):
            continue
        key = _extract_sheet_key(row)
        if not key:
            continue

        line = _row_to_line(row, key)
        for sr, name in _split_multi_entries(line):
            if not sr or not name:
                continue

            if sr == "#" or name.lower() in {"client", "name", "client name"}:
                continue

            name = _normalize_name(name)
            if not name:
                continue

            out.append({"#": sr, "Client Name": name})

    return out


def post_bulk_import(api_base: str, rows: list[dict[str, str]], batch_size: int, timeout: float) -> dict[str, Any]:
    url = api_base.rstrip("/") + "/api/client-management/import-bulk"

    totals = {"imported": 0, "skipped": 0, "errors": []}

    with httpx.Client(timeout=timeout) as client:
        for i in range(0, len(rows), batch_size):
            batch = rows[i : i + batch_size]
            resp = client.post(url, json=batch)
            resp.raise_for_status()
            r = resp.json()

            totals["imported"] += int(r.get("imported", 0) or 0)
            totals["skipped"] += int(r.get("skipped", 0) or 0)
            totals["errors"].extend(list(r.get("errors", []) or []))

    return totals


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--file", required=True)
    p.add_argument("--api", default="http://127.0.0.1:8000")
    p.add_argument("--batch-size", type=int, default=200)
    p.add_argument("--timeout", type=float, default=60.0)
    args = p.parse_args()

    rows = parse_sheet_json(args.file)
    if not rows:
        raise SystemExit("No client rows detected in JSON")

    totals = post_bulk_import(args.api, rows, args.batch_size, args.timeout)
    print(json.dumps({"parsed": len(rows), **totals}, indent=2))


if __name__ == "__main__":
    main()
