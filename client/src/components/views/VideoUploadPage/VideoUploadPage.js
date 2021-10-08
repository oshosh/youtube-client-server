import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import useInput from "../../../hooks/useInput";
import CustomOption from "../../comm/CustomOption";
import axios from "axios";
import { LOCAL_SERVER } from "../../Config";
import { useSelector } from "react-redux";

const PrivateOption = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
];

const CatogoryOption = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
];
const MAX_SIZE = 1024 * 1024 * 70;

function VideoUploadPage(props) {
    const userInfo = useSelector((state) => state.user);

    //input
    const [title, onChangeTitle] = useInput("");
    //textarea
    const [description, onChangeDescription] = useInput("");
    // option
    const [privateKey, onChangePrivateKey] = useInput(0);
    const [categories, onChangeCategories] = useInput("Film & Animation");

    //video 파일 경로 저장 state
    const [filePath, setFilePath] = useState("");

    // 썸네일 저장 state
    const [duration, setDuration] = useState("");
    const [thumbnailPath, setThumbnailPath] = useState("");

    const onDrop = useCallback((files) => {
        let formData = new FormData();
        const config = {
            header: { "content-type": "multipart/form-data" },
        };
        formData.append("file", files[0]);

        // 비디오 업로드 하기 (.mp4 파일만)
        axios.post("/api/video/uploadfiles", formData, config).then((response) => {
            if (response.data.success) {
                let variable = {
                    filePath: response.data.filePath, // upload 경로
                    fileName: response.data.fileName, // 올린 파일 이름
                };
                setFilePath(response.data.filePath);

                // 썸네일 생성하기
                axios.post("/api/video/thumbnail", variable).then((response) => {
                    if (response.data.success) {
                        setDuration(response.data.fileDuration);
                        setThumbnailPath(response.data.thumbsFilePath);
                    } else {
                        alert("썸네일 생성에 실패 했습니다.");
                    }
                });
            } else {
                alert("비디오 업로드 실패");
            }
        });
    }, []);

    const onSubmit = useCallback(
        (e) => {
            e.preventDefault();

            const variables = {
                writer: userInfo.userData._id,
                title,
                description,
                privacy: privateKey,
                filePath: filePath,
                catogory: categories,
                duration: duration,
                thumbnail: thumbnailPath,
            };

            axios.post("/api/video/uploadVideo", variables).then((response) => {
                console.log(response.data.success);
                //   if(response.data){

                //   }else{

                //   }
            });
        },
        [userInfo, title, description, privateKey, filePath, categories, duration, thumbnailPath]
    );

    return (
        <VideoWrapper>
            <div className="video-container">
                <Typography.Title level={2}>Upload Video</Typography.Title>
            </div>

            <AntdForm onSubmit={onSubmit}>
                <div className="form-container">
                    {/* dropzone */}
                    <Dropzone onDrop={onDrop} multiple={false} maxSize={MAX_SIZE}>
                        {({ getRootProps, getInputProps }) => (
                            <div className="dropzone-container" {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Icon type="plus" style={{ fontSize: "3rem" }} />
                            </div>
                        )}
                    </Dropzone>
                    {/* 썸네일 */}
                    {thumbnailPath && (
                        <div>
                            <img src={`${LOCAL_SERVER}/${thumbnailPath}`} alt="thumbnail" />
                        </div>
                    )}
                </div>

                <br />
                <br />

                <Input onChange={onChangeTitle} value={title} />

                <br />
                <br />
                <label>Description</label>
                <Input.TextArea onChange={onChangeDescription} value={description} />
                <br />
                <br />

                <select onChange={onChangePrivateKey}>
                    {<CustomOption list={PrivateOption} />}
                </select>

                <br />
                <br />
                <select onChange={onChangeCategories}>
                    {<CustomOption list={CatogoryOption} />}
                </select>
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Sumbit
                </Button>
            </AntdForm>
        </VideoWrapper>
    );
}

export default VideoUploadPage;

const VideoWrapper = styled.div`
  max-width: 700px;
  margin: 2rem auto;

  & .video-container {
    text-align: "center";
    margin-bottom: 2rem;
  }
`;

const AntdForm = styled(Form)`
  & .form-container {
    display: flex;
    justify-content: space-between;
  }

  & .dropzone-container {
    display: flex;
    width: 300px;
    height: 240px;
    border: 1px solid lightgray;
    align-items: center;
    justify-content: center;
  }
`;
