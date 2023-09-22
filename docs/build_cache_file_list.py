#! /usr/bin/env python
from pathlib import Path
from pprint import pprint

# source = ''       # when using root - check
source = 'docs'     # when using /docs as source - removes docs from the path
repo_name = 'dtk_wgt_graph'
project_root = Path('/Users/simon/a_syllabus/lang/html_css_js/dtk_wgt_graph/docs/static')
                     

# const FILES_TO_CACHE = [
#   '/static/offline.html',
# ];

def get_list_of_potential_files_to_cache(search_path, cache_root):    
    paths = []
    dir_before_root = str(search_path).split('/')[str(search_path).split('/').index(cache_root)-1]
    
    print(dir_before_root)
    print(search_path)
    
    print('const FILES_TO_CACHE = [')
    
    for p in search_path.glob('**/*'):
        path = str(p)
        if 'node_modules' in path or 'scratch' in path or p.is_dir() or '.DS_Store' in path: continue
        comps = str(p).split(dir_before_root)
        cache_targets = Path(comps.pop())
        print(f"  '/{repo_name}{cache_targets}',")
       
        
        #print(f"  '/{cache_targets}',")
        paths.append(cache_targets)    
    
    print('];')
    
    return paths

def main():
    pass


if __name__ == '__main__':
    
    paths = get_list_of_potential_files_to_cache(project_root, 'static')
    
    
