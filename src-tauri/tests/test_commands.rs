use yuubin::tauri_commands::delete_file;
use std::fs::{self, File};
use std::io::Write;

// NOTE
// When performing tests, the data_path in config.toml 
// must point to the test folder since it is used in
// the command functions

#[cfg(test)]
mod integration_tests {
    use std::env::current_dir;
    use super::*;

    #[test]
    fn test_delete_file() {
        let collection = "test_collection".to_string();
        let request = "test_file".to_string();
        let data_path = current_dir().unwrap().join("tests");
        let collection_path = data_path.join(&collection);
        let file_path = collection_path.join(&request).with_extension("toml");

        fs::create_dir_all(&collection_path).unwrap();
        let mut file = File::create(&file_path).unwrap();
        writeln!(file, "test data").unwrap();

        assert!(file_path.exists(), "Test file does not exist");

        // Call the delete_file command
        let response = delete_file(collection.clone(), request.clone());
        println!("{:?}",response);

        // Check the response
        assert!(response.success, "The delete_file function did not succeed");
        assert_eq!(response.message, "Success", "Execpected message returned");

        // Ensure the file has been deleted
        assert!(!file_path.exists(), "Test file was not deleted");

        // Cleanup
        fs::remove_dir_all(collection_path).unwrap();
    }
}

