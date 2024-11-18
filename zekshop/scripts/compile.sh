#!/bin/bash
cd ..
compile_example() {
    project=$1
    echo "Compiling $project"
    
    # Use pushd to change to the project directory and save the current directory
    pushd "$project" > /dev/null
    
    # Run the compile command and check if it was successful
    if nargo compile --force --silence-warnings; then
        echo "Compiled successfully!"
    else
        echo "Compilation failed for $project"
    fi
    
    # Use popd to return to the previous directory
    popd > /dev/null
}

# Loop over every child folder in the circuits directory, excluding `node_modules` and `client`
for folder in ./circuits/*/; do
    if [ -d "$folder" ] && [[ "$folder" != *"node_modules"* ]] && [[ "$folder" != *"client"* ]]; then
        compile_example "$folder"
    fi
done
