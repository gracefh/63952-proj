import React , {useState} from 'react';
import { uploadFile } from 'react-s3';
import axios from "axios";


const UploadImageToS3WithReactS3 = () => {

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    }


    const handleUpload = async (file) => {
        const response = await axios.get(
            `/api/presignedUrl?fileType=${encodeURIComponent(file.type.split("/")[1])}`
        )
        console.log(response);
        const {key, uploadUrl} = response.data;
        await axios.put(uploadUrl, file);
        return key;
    }

    return <><div>
        <div>React S3 File Upload</div>
        <input type="file" onChange={handleFileInput}/>
        <button onClick={() => handleUpload(selectedFile)}> Upload to S3</button>
    </div></>
}

export default UploadImageToS3WithReactS3;