#!/usr/bin/env python
import subprocess
import sys

# First, install pdfplumber
subprocess.check_call([sys.executable, "-m", "pip", "install", "pdfplumber", "-q"])

# Then extract PDF
import pdfplumber

pdf_path = 'SRS_CoreConnect.pdf'
with pdfplumber.open(pdf_path) as pdf:
    text = ''.join([page.extract_text() or '' for page in pdf.pages])
    print(text)
