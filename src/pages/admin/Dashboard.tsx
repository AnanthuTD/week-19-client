import React, { useEffect, useState, useRef, lazy } from "react";
import { message, Spin, Form } from "antd";
import type { InputRef, TableColumnType, TableProps } from "antd";
import axios from "axios";
import { User } from "../../types";
import { FilterDropdownProps } from "antd/es/table/interface";
import { axiosPrivate } from "../../lib/axiosPrivate";
import { RootState } from "../../app/store";
import { useSelector } from "react-redux";

const Table = lazy(() => import("antd/lib/table/Table"));
const Result = lazy(() => import("antd/lib/result"));
const Select = lazy(() => import("antd/lib/select"));
const InputNumber = lazy(() => import("antd/lib/input-number"));
const Popconfirm = lazy(() => import("antd/lib/popconfirm"));
const TypoLink = lazy(() => import("antd/lib/typography/Link"));
const Input = lazy(() => import("antd/lib/input"));
const Button = lazy(() => import("antd/lib/button"));
const SearchOutlined = lazy(() => import("@ant-design/icons/SearchOutlined"));
const Space = lazy(() => import("antd/lib/space"));

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
	editing: boolean;
	dataIndex: string;
	title: string;
	inputType: "number" | "text" | "select";
	record: User;
	index: number;
	key: string;
	fallbackDataIndex: string;
}

interface ExtendedUser extends User {
	lastName: string;
	firstName: string;
}

interface EditableColumnType extends Omit<TableColumnType<User>, "children"> {
	[x: string]: unknown;
	editable?: boolean;
	fallBackDataIndex?: string;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
	editing,
	dataIndex,
	fallbackDataIndex,
	title,
	inputType,
	children,
	...restProps
}) => {
	let inputNode = null;

	switch (inputType) {
		case "number":
			inputNode = <InputNumber />;
			break;
		case "select":
			inputNode = (
				<Select
					options={[
						{ value: "admin", label: "admin" },
						{ value: "user", label: "user" },
					]}
				/>
			);
			break;

		default:
			inputNode = <Input />;
			break;
	}

	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={
						dataIndex || fallbackDataIndex
					} /* if no dataIndex is provided fallback to key. since usage of both render and dataIndex are not supported by table */
					style={{ margin: 0 }}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}
				>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const App: React.FC = () => {
	const [form] = Form.useForm();
	const [data, setData] = useState<User[] | []>([]);
	const [editingKey, setEditingKey] = useState("");
	const [dataLoading, setDataLoading] = useState(true);
	const user = useSelector((state: RootState) => state.user.data);
	const searchInput = useRef<InputRef>(null);

	const handleSearch = async (
		selectedKeys: string[],
		confirm: FilterDropdownProps["confirm"],
		dataIndex: string
	) => {
		confirm();
		try {
			const res = await axiosPrivate.get(
				`/api/admin/user/search?col=${dataIndex}&query=${selectedKeys[0]}`
			);
			setData(res.data?.users);
		} catch (error) {
			message.error("Failed to search!");
		}
	};

	const handleReset = (clearFilters: () => void) => {
		clearFilters();
		loadUser();
	};

	const getColumnSearchProps = (dataIndex: string): TableColumnType<User> => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys as string[], confirm, dataIndex)
					}
					style={{ marginBottom: 8, display: "block" }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() =>
							handleSearch(selectedKeys as string[], confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
		),
	});

	async function loadUser() {
		try {
			const { data } = await axiosPrivate.get("/api/admin/user");
			setData(data.users || []);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.data) {
				message.error(error.response.data.msg || "something went wrong!");
			}
		} finally {
			setDataLoading(false);
		}
	}

	useEffect(() => {
		loadUser();
	}, []);

	const isEditing = (record: User) => record._id === editingKey;

	const edit = (record: Partial<User>) => {
		form.setFieldsValue({ ...record, ...record.name });
		setEditingKey(record._id!);
	};

	const cancel = () => {
		setEditingKey("");
	};

	const save = async (id: string) => {
		try {
			const row = (await form.validateFields()) as ExtendedUser;

			const newData = [...data];
			const index = newData.findIndex((item) => id === item._id);
			if (index > -1) {
				const item = newData[index];

				const newItem = {
					...item,
					...row,
					name: {
						firstName: row.firstName,
						lastName: row.lastName,
					},
				};
				newData.splice(index, 1, newItem);
				try {
					const res = await axiosPrivate.patch("/api/admin/user", {
						user: newItem,
					});
					setData(newData);
					setEditingKey("");
					message.success(res.data.msg);
				} catch (error) {
					if (axios.isAxiosError(error)) {
						message.error(
							error?.response?.data.msg || error.response?.statusText
						);
					} else message.error("Something went wrong!");
				}
			}
		} catch (errInfo) {
			console.error("Validate Failed:", errInfo);
			message.error("Validation Failed!");
		}
	};

	const handleDelete = async (id: string) => {
		if (user?._id === id)
			return message.warning("Are you trying to delete yourself?");
		try {
			const index = data.findIndex((item) => item._id === id);
			if (index > -1) {
				try {
					const res = await axiosPrivate.delete("/api/admin/user/" + id);
					const newData = [...data];
					newData.splice(index, 1);
					setData(newData);
					message.success(res.data.msg);
				} catch (error) {
					if (axios.isAxiosError(error)) {
						message.error(
							error?.response?.data.msg || error.response?.statusText
						);
					} else message.error("Something went wrong!");
				}
			} else {
				message.error("Data does not exist!");
			}
		} catch (error) {
			message.error("Validation Failed!");
		}
	};

	const columns: EditableColumnType[] = [
		{
			title: "Id",
			width: 100,
			dataIndex: "_id",
			key: "_id",
			// fixed: "left",
			...getColumnSearchProps("_id"),
		},
		{
			title: "First Name",
			width: 100,
			key: "firstName",
			editable: true,
			render: (record: User) => <span>{record?.name?.firstName || ""}</span>,
			fallBackDataIndex: "firstName",
			...getColumnSearchProps("firstName"),
		},
		{
			title: "Last Name",
			key: "lastName",
			width: 150,
			editable: true,
			render: (record: User) => <span>{record?.name?.lastName || ""}</span>,
			fallBackDataIndex: "lastName",
			...getColumnSearchProps("lastName"),
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			editable: true,
			width: 150,
			...getColumnSearchProps("email"),
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			editable: true,
			width: 70,
			...getColumnSearchProps("role"),
		},
		{
			title: "Action",
			key: "operation",
			// fixed: "right",
			width: 100,
			render: (_: string, record: User) => {
				const editable = isEditing(record);
				return editable ? (
					<span>
						<TypoLink
							onClick={() => save(record._id)}
							style={{ marginRight: 8 }}
						>
							Save
						</TypoLink>
						<Popconfirm title="Sure to cancel?" onConfirm={cancel}>
							<a>Cancel</a>
						</Popconfirm>
					</span>
				) : (
					<span>
						<Button
							disabled={editingKey !== ""}
							onClick={() => edit(record)}
							style={{ marginRight: 8 }}
							type="primary"
						>
							Edit
						</Button>
						<Popconfirm
							title="Are you sure to delete this user?"
							onConfirm={() => handleDelete(record._id)}
						>
							<Button danger>Delete</Button>
						</Popconfirm>
					</span>
				);
			},
		},
	];

	// @ts-expect-error wow
	const mergedColumns: TableProps["columns"] = columns.map((col) => {
		if (!col.editable) {
			return col;
		}
		return {
			...col,
			onCell: (record: User) => {
				let inputType = "text";
				switch (col.dataIndex) {
					case "age":
						inputType = "number";
						break;
					case "role":
						inputType = "select";
						break;
				}
				return {
					record,
					inputType,
					dataIndex: col.dataIndex,
					title: col.title,
					fallbackDataIndex: col.key, // fallback if no data index specified
					editing: isEditing(record),
				};
			},
		};
	});

	/* if (!user) {
		return <Navigate to="/login" replace />;
	} */

	return dataLoading ? (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<Spin size="large" tip="loading users" />
		</div>
	) : data.length ? (
		<Form form={form} component={false}>
			<Table
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				bordered
				dataSource={data}
				columns={mergedColumns}
				rowClassName="editable-row"
				pagination={{
					onChange: cancel,
				}}
				scroll={{ x: 1500 }}
				sticky={{ offsetHeader: 64 }}
			/>
		</Form>
	) : (
		<Result
			title="No user found!"
			extra={
				<Button type="primary" key="console" onClick={loadUser}>
					Reload Data
				</Button>
			}
		/>
	);
};

export default App;
