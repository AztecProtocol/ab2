#!/bin/bash
compile_example() {
    project=$1
    echo "Compiling $project"

    project_name=$(basename "$project")
    
    # Use pushd to change to the project directory and save the current directory
    pushd "$project" > /dev/null
    
    # Run the compile command
    aztec-nargo compile --force --silence-warnings --package ${project_name}
    
    # Use popd to return to the previous directory
    popd > /dev/null

}

for project in crates/*[^modules]*; do
    if [ -d "$project" ]; then
        compile_example "$project"
    fi
done


for module in crates/modules/*; do
    if [ -d "$module" ]; then
        compile_example "$module"
    fi
done