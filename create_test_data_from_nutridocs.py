#! /usr/bin/env python

import sys
from pathlib import Path
from pprint import pprint
import re
import json # JSONDecodeError
from datetime import datetime
from timestamping import nix_time_ms, hr_readable_date_from_nix #, hr_readable_w_nix_ms_from_nix
import shutil
# RTF conversion to text
from striprtf.striprtf import rtf_to_text

opt_dict = {
    'verbose_mode':     False,
}

if '-v' in sys.argv:
    opt_dict['verbose_mode'] = True


help_string = '''
- - - options - - - 
-v          verbose_mode

-h          This help
'''

if ('-h' in sys.argv) or ('--h' in sys.argv) or ('-help' in sys.argv) or ('--help' in sys.argv):
    print(help_string)
    sys.exit(0)




DATA_FILE_JSON = Path('./docs/static/js_modules/content/dtk_data.json')
#DATA_FILE_JS = Path('./docs/static/js_modules/content/dtk_data.js')
DATA_FILE_JS_SINGLE_PAGE = Path('./single_page_canvas/dtk_data.js')
DATA_FILE_JS_TEST_PWA = Path('./docs/static/js_modules/content/dtk_data.js')



# with open(DATA_FILE_JSON, 'r') as f:
#     record = json.load(f)

# record_to_json_file = json.dumps(record)
# with open(DATA_FILE_JSON, 'w') as f:
#     f.write(record_to_json_file)

def get_nutridoc_list_rtf(base_dir):    

    #y971_NUTRITEST_recipes_20191123-06.rtf

    file_LUT = {}
    nutri_doc_ref =''

    print(f'\nNutridocs Found:{base_dir}')
    for file_loc in base_dir.rglob('*_NUTRITEST_recipes_*.rtf'):        
        nutri_doc_ref = re.search(r'(y\d{3})_', file_loc.stem).group(1)
        file_LUT[nutri_doc_ref] = file_loc

        if opt_dict['verbose_mode']:
            print(f"{nutri_doc_ref} : {file_loc.name} - {file_loc} ")
        else:
            print(re.search(r'(y\d{3})_', file_loc.stem).group(1), end=' ')
    
    print('\n')

    sorted_file_LUT = dict(sorted(file_LUT.items()))

    return sorted_file_LUT

nutridocs_base_dir = Path('/Users/simon/Desktop/supperclub/foodlab/_MENUS/_courses_components/')
file_LUT = get_nutridoc_list_rtf(nutridocs_base_dir)


def get_text_content_of_file(rtf_filepath):

    with open(rtf_filepath,'r') as f:
        rtf = f.read()

    content = rtf_to_text(rtf)
    # _course_cost_end_ remove text after this point
    content_data, content_notes = content.split('_course_cost_end_')

    # print('\n\n\n\n\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
    # pprint(content_notes)
    # print('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - \n\n\n\n\n')

    return  content_data

record = {}
c = 0
for k,f in file_LUT.items():
    txt = get_text_content_of_file(f)
    print(f"\n\n{k} - {f}")
    
    patLine = r"^-*? (for the.*?calories.*?)$"
    # from m02     yr             mnth                  dayL                  dayD      wgt
    pat02 =  r"(\d\d\d\d).*?month (\d+)\s+(day|mon|tue|wed|thu|fri|sat|sun)\s+(\d+).*?(\d+\.\d+)kg"
    pat03 =  r"fat.*?(\d\d\.\d).*?h2o.*?(\d\d\.\d)"
    patZ = r"(\d+\.\d+kg)(?:.*?fat_pc.*?(\d+\.\d+))?.*?(?:H2O_pc.*?(\d+\.\d+))?"

    for line in txt.splitlines():
        m1 = re.match(patLine, line, re.I)
        if m1:
            if 'sun mon tue' in line: continue
            yr,mnth,dayD = 1970,1,1
            lipids, h2o = None, None

            print(f"M(1): {m1.group(1)}")
            
            m02 = re.search(pat02, line, re.I)
            if m02:
                yr, mnth, dayL, dayD, wgt = m02.groups()
            
            m03 = re.search(pat03, line, re.I)
            if m03:
                lipids, h2o = m03.groups()
            
            
            nix_time = nix_time_ms(datetime(int(yr),int(mnth),int(dayD)))
            hr_date = hr_readable_date_from_nix(nix_time)   # pad out single digits
            record[nix_time] = {'synthetic': False,         # IE recorded not interpolated
                                'dtk_pc_fat': lipids,
                                'dtk_pc_h2o': h2o,
                                'dtk_rcp': {'dt_date': nix_time,
                                            'dt_date_readable': hr_date,
                                            'dt_day': dayL},
                                'dtk_user_info': {'UUID': 'x-x-x-x-xxx',
                                                'name': 'AGCT'},
                                'dtk_weight': wgt}

#pprint(record)

record_to_json = json.dumps(record)
with open(DATA_FILE_JSON, 'w') as f:
    f.write(record_to_json)

record_js = f"export let dtkTestRecord = {record_to_json};"

with open(DATA_FILE_JS_SINGLE_PAGE, 'w') as f:
    f.write(record_js)

with open(DATA_FILE_JS_TEST_PWA, 'w') as f:
    f.write(record_js)
