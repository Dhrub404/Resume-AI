
import os

file_path = r'c:\Users\shubh\Downloads\Resume-AI\resumeai-frontend\src\components\layout\AppLayout.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    stripped = line.strip()
    if stripped.startswith('<svg') and 'M9 18l6-6-6-6' in stripped:
        # Replace only the expand chevron, not the collapse one (which is M15 18)
        indent = line[:line.find('<svg')]
        new_lines.append(f'{indent}<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>\n')
    else:
        new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
