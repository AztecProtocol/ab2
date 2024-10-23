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

# Loop over every child folder in the examples directory
for folder in ./crates/*/; do
    if [ -d "$folder" ]; then
        compile_example "$folder"
    fi
done