import { useState } from 'react';

import styles from './index.module.scss';

export default function Home() {
	const [selectedFile, setSelectedFile] = useState();
  const [prompt, setPrompt] = useState('');
	const [imgUrl, setImgUrl] = useState('');

	async function onSubmit(event) {
    event.preventDefault();
    const fileData = new FormData();
    fileData.append('upload_file', selectedFile);
    fileData.append('prompt', prompt);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        // body: fileData,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setImgUrl(data.result);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

	const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }

	return (
		<div className={styles.pageWrapper}>
			<div className={styles.pageContent}>
				<form onSubmit={onSubmit}>
					<input
						type="file"
						name="upload_file"
						accept=".png,.jpeg"
						onChange={handleFileChange}
					/>
					<input
						type="text"
						value={prompt}
						onChange={(e) => { setPrompt(e.target.value) }}
					/>
					<input type="submit" value="Generate names" />
				</form>
				<img src={imgUrl} alt={prompt} />
			</div>
		</div>
	)
}