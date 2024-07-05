use yuubin::tauri_commands::{delete_file, delete_directory, create_file, rename_file, edit_file};
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

    // Create the directory
    // Call the delete_file command
    // Check the response
    // Ensure the file has been deleted
    // Cleanup

    #[test]
    fn test_delete_file() {
        let collection = "test_collection_1".to_string();
        let request = "test_file".to_string();
        let data_path = current_dir().unwrap().join("tests");
        let collection_path = data_path.join(&collection);
        let file_path = collection_path.join(&request).with_extension("toml");

        fs::create_dir_all(&collection_path).unwrap();
        let mut file = File::create(&file_path).unwrap();
        writeln!(file, "test data").unwrap();

        assert!(file_path.exists(), "Test file does not exist");

        let response = delete_file(collection.clone(), request.clone());
        println!("{:?}",response);

        assert!(response.success, "The delete_file function did not succeed");
        assert_eq!(response.message, "Success", "Execpected message returned");

        assert!(!file_path.exists(), "Test file was not deleted");

        fs::remove_dir_all(collection_path).unwrap();
    }

    #[test]
    fn test_delete_directory() {
        let collection = "test_collection_2".to_string();
        let data_path = current_dir().unwrap().join("tests");
        let collection_path = data_path.join(&collection);

        fs::create_dir_all(&collection_path).unwrap();
        assert!(collection_path.exists(), "Test directory does not exist");

        let response = delete_directory(collection.clone());
        println!("{:?}", response);

        assert!(response.success, "The delete_directory function did not succeed");
        assert_eq!(response.message, "Success", "Expected message returned");

        assert!(!collection_path.exists(), "Test directory was not deleted");

        if collection_path.exists() {
            fs::remove_dir_all(collection_path).unwrap();
        }
    }

    #[test]
    fn test_create_file() {
        let collection = "test_collection_3".to_string();
        let request_data = r#"{
        "method": "GET",
        "url": "http://example.com",
        "body": "",
        "auth": null,
        "headers": [],
        "params": [],
        "meta": {
            "name": "test_file",
            "id": "1"
        }
    }"#.to_string();
        let data_path = current_dir().unwrap().join("tests");
        let collection_path = data_path.join(&collection);
        let file_path = collection_path.join("test_file").with_extension("toml");

        fs::create_dir_all(&collection_path).unwrap();
        assert!(collection_path.exists(), "Test collection directory does not exist");

        let response = create_file(request_data.clone(), collection.clone());
        println!("{:?}", response);

        assert!(response.success, "The create_file function did not succeed");
        assert_eq!(response.message, "Success", "Expected message returned");

        assert!(file_path.exists(), "Test file was not created");

        fs::remove_dir_all(collection_path).unwrap();
    }

    #[test]
    fn test_edit_file() {
        let collection = "test_collection_4".to_string();
        let initial_data = r#"{
        "method": "GET",
        "url": "http://example.com",
        "body": "",
        "auth": null,
        "headers": [],
        "params": [],
        "meta": {
            "name": "test_file",
            "id": "1"
        }
    }"#.to_string();
        let edited_data = r#"{
        "method": "POST",
        "url": "http://example.com",
        "body": "new body content",
        "auth": null,
        "headers": [],
        "params": [],
        "meta": {
            "name": "test_file",
            "id": "1"
        }
    }"#.to_string();
        let data_path = current_dir().unwrap().join("tests");
        let collection_path = data_path.join(&collection);
        let file_path = collection_path.join("test_file").with_extension("toml");

        fs::create_dir_all(&collection_path).unwrap();
        let mut file = File::create(&file_path).unwrap();
        writeln!(file, "{}", initial_data).unwrap();
        assert!(file_path.exists(), "Test file does not exist");

        let response = edit_file(edited_data.clone(), collection.clone());
        println!("{:?}", response);

        assert!(response.success, "The edit_file function did not succeed");
        assert_eq!(response.message, "Success", "Expected message returned");

        let content = fs::read_to_string(&file_path).unwrap();
        assert!(content.contains("method = \"POST\""), "Test file was not edited correctly");

        fs::remove_dir_all(collection_path).unwrap();
    }

    #[test]
    fn test_rename_file() {
        let collection = "test_collection_5".to_string();
        let initial_data = r#"{
        "method": "GET",
        "url": "http://example.com",
        "body": "",
        "auth": null,
        "headers": [],
        "params": [],
        "meta": {
            "name": "new_test_file",
            "id": "1"
        }
    }"#.to_string();
        let old_request_name = "test_file".to_string();
        let data_path = current_dir().unwrap().join("tests");
        let collection_path = data_path.join(&collection);
        let old_file_path = collection_path.join(&old_request_name).with_extension("toml");
        let new_file_path = collection_path.join("new_test_file").with_extension("toml");

        fs::create_dir_all(&collection_path).unwrap();
        let mut file = File::create(&old_file_path).unwrap();
        writeln!(file, "method = \"GET\"\nurl = \"http://example.com\"\nbody = \"\"\n").unwrap();
        assert!(old_file_path.exists(), "Old test file does not exist");

        let response = rename_file(initial_data.clone(), collection.clone(), old_request_name.clone());
        println!("{:?}", response);

        assert!(response.success, "The rename_file function did not succeed");
        assert_eq!(response.message, "Success", "Expected message returned");

        assert!(!old_file_path.exists(), "Old test file was not renamed");
        assert!(new_file_path.exists(), "New test file was not created");

        let content = fs::read_to_string(&new_file_path).unwrap();
        assert!(content.contains("method = \"GET\""), "New test file does not contain the correct data");

        //fs::remove_dir_all(collection_path).unwrap();
    }
}

