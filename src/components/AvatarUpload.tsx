import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload, message } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { axiosPrivate } from "../lib/axiosPrivate";
import { updateUser } from "../features/user/userSlice";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const AvatarUpload: React.FC = () => {
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState("");
	const user = useSelector((state: RootState) => state.user.data);
	const dispatch = useDispatch();
	const initialAvatar: UploadFile[] = user?.avatar
		? [
				{
					uid: "0",
					name: "current-avatar",
					status: "done",
					url: user.avatar,
				},
		  ]
		: [];
	const [fileList, setFileList] = useState<UploadFile[]>(initialAvatar);

	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as FileType);
		}
		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
	};

	const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
		setFileList(newFileList);

	const handleUpload = async (options: any) => {
		const formData = new FormData();
		formData.append("avatar", options.file);

		try {
			setFileList([
				{
					uid: "0",
					name: "current-avatar",
					status: "uploading",
					url: user?.avatar,
				},
			]);
			const { data }: { data: { avatar: string } } = await axiosPrivate.post(
				"/api/user/upload/avatar",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);

			dispatch(updateUser({ avatar: data.avatar }));
			setFileList([
				{
					uid: "0",
					name: "current-avatar",
					status: "done",
					url: data?.avatar,
				},
			]);
			message.success("Avatar uploaded successfully!");
		} catch (error) {
			setFileList([
				{
					uid: "0",
					name: "current-avatar",
					status: "done",
					url: user?.avatar,
				},
			]);
			message.error("Failed to upload avatar.");
		}
	};

	const beforeUpload = (file: FileType) => {
		const isImage = file.type.startsWith("image/");
		if (!isImage) {
			message.error("You can only upload image files!");
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error("Image must be smaller than 2MB!");
		}
		return isImage && isLt2M;
	};

	const uploadButton = (
		<button style={{ border: 0, background: "none" }} type="button">
			<PlusOutlined />
			<div style={{ marginTop: 8 }}>Upload</div>
		</button>
	);

	return (
		<>
			<Upload
				customRequest={handleUpload}
				listType="picture-circle"
				fileList={fileList}
				onPreview={handlePreview}
				onChange={handleChange}
				beforeUpload={beforeUpload}
			>
				{fileList.length >= 1 ? null : uploadButton}
			</Upload>
			{previewImage && (
				<Image
					wrapperStyle={{ display: "none" }}
					preview={{
						visible: previewOpen,
						onVisibleChange: (visible) => setPreviewOpen(visible),
						afterOpenChange: (visible) => !visible && setPreviewImage(""),
					}}
					src={previewImage}
				/>
			)}
		</>
	);
};

export default AvatarUpload;
