#!/bin/bash

function print_files_tree() {
    local dir="$1"
    local indent="$2"
    local items=$(ls -A "$dir")

    for item in $items; do
        if [ -d "${dir}/${item}" ]; then
            echo "${indent}${item}/"
            print_files_tree "${dir}/${item}" "  ${indent}"
        else
            echo "${indent}${item}"
        fi
    done
}

directory="/Users/asimovia/prj/pwc/sync/open-api-tool/api"

print_files_tree "$directory" ""