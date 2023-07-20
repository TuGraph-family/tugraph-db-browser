import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
  UploadProps,
  message,
} from "antd";
import { FormInstance } from "antd/es/form";
import { UploadChangeParam, UploadFile } from "antd/lib/upload";
import { includes, map } from "lodash";
import React from "react";
import { useImmer } from "use-immer";
import {
  CPP_CODE_TYPE,
  PUBLIC_PERFIX_CLASS,
  STORED_OPTIONS,
  STORED_PROCEDURE_RULE,
} from "../../../../../../constant";
import { useProcedure } from "../../../../../../hooks/useProcedure";
import { StoredDownLoad } from "../../stored-download";

import styles from "./index.module.less";

type Prop = {
  form: FormInstance<any>;
  visible: boolean;
  onCancel: () => void;
  graphName: string;
  refreshList: (type: "cpp" | "python" | "all") => void;
};
type Options =
  | {
      label: string;
      options: {
        value: string;
        label: string;
      }[];
    }[]
  | undefined;
const { Item } = Form;
const { Group } = Radio;

export const StoredForm: React.FC<Prop> = ({
  form,
  visible,
  onCancel,
  graphName,
  refreshList,
}) => {
  const { onUploadProcedure, UploadProcedureLoading } = useProcedure();
  const [state, updateState] = useImmer<{
    demoVisible: boolean;
    content: string;
    demoValue: string;
    isPy: boolean;
  }>({
    demoVisible: false,
    content: "",
    demoValue: "cpp_v1",
    isPy: false,
  });
  const { demoVisible, content, demoValue, isPy } = state;
  const props: UploadProps = {
    name: "file",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      if (info.file.status === "done") {
        message.success("文件上传成功");
      } else if (info.file.status === "error") {
        message.error("文件上传失败");
      }
    },
    maxCount: 1,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (result) => {
        updateState((draft) => {
          draft.content = result.target?.result as string;
        });
      };
    },
  };
  // 处理OptGroup数据
  const options = (options: Options) => {
    return map(options, (option) => {
      if (option.options) {
        return {
          ...option,
          options: map(option.options, (item) => ({
            ...item,
            label: (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div>{item.label}</div>
                {(item.value === "cpp" || item.value === "py") && (
                  <a
                    onClick={() => {
                      updateState((draft) => {
                        draft.demoVisible = true;
                      });
                    }}
                  >
                    demo下载
                  </a>
                )}
              </div>
            ),
          })),
        };
      }
      return option;
    });
  };
  // 取消新增储存过程
  const cancelUpdate = () => {
    updateState((draft) => {
      draft.content = "";
    });
    onCancel();
    form.resetFields();
  };
  // 填充空值的默认值
  const fillFormDefaultValue = (val: any) => {
    const fillKeys = ["description"];
    fillKeys.forEach((key) => {
      if ([undefined].includes(val[key])) {
        val[key] = "";
      }
    });
  };
  // 新增存储过程
  const uploadProcedure = () => {
    form.validateFields().then((val) => {
      const cacheVal = { ...val };
      fillFormDefaultValue(cacheVal);
      let procedureType: "cpp" | "python";
      if (includes(CPP_CODE_TYPE, val.codeType)) {
        procedureType = "cpp";
      } else {
        procedureType = "python";
      }
      onUploadProcedure({
        ...cacheVal,
        graphName,
        procedureType,
        content: btoa(content),
      }).then((res) => {
        if (res.errorCode === "200") {
          message.success("新增成功");
          updateState((draft) => {
            draft.content = "";
          });
          onCancel();
          form.resetFields();
          refreshList(procedureType);
        }
      });
    });
  };
  return (
    <>
      <Modal
        title={"新建存储过程"}
        visible={visible}
        onCancel={onCancel}
        width={480}
        destroyOnClose
        className={styles[`${PUBLIC_PERFIX_CLASS}-form`]}
        footer={
          <>
            <Button type="default" onClick={cancelUpdate}>
              取消
            </Button>
            <Button
              loading={UploadProcedureLoading}
              type="primary"
              onClick={uploadProcedure}
            >
              确定
            </Button>
          </>
        }
      >
        <Form form={form} layout="vertical">
          <Item
            label="存储过程名称"
            name="procedureName"
            rules={[{ required: true, message: "请输入" }]}
          >
            <Input placeholder="请输入" />
          </Item>
          <Item
            label="存储过程类型"
            name="codeType"
            rules={[{ required: true, message: "请选择" }]}
          >
            <Select
              onSelect={(val) => {
                updateState((draft) => {
                  if (val === "py") {
                    draft.isPy = true;
                    form.setFieldsValue({ version: "v1" });
                  } else {
                    draft.isPy = false;
                  }
                });
              }}
              options={options(STORED_OPTIONS)}
            />
          </Item>

          <Item label="存储过程描述" name="description">
            <Input.TextArea placeholder="请输入" />
          </Item>

          <Row>
            <Col span={24}>
              <Item
                label="版本"
                tooltip={
                  <>
                    <div className={styles[`${PUBLIC_PERFIX_CLASS}-rule`]}>
                      {map(STORED_PROCEDURE_RULE, (rule, index) => (
                        <div key={index}>{rule.desc}</div>
                      ))}
                    </div>
                  </>
                }
                name="version"
                rules={[{ required: true, message: "请选择" }]}
                className={styles[`${PUBLIC_PERFIX_CLASS}-readonly-horizontal`]}
              >
                <Group>
                  <Radio value={"v1"}>v1</Radio>
                  <Radio disabled={isPy} value={"v2"}>
                    v2
                  </Radio>
                </Group>
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Item
                label="执行时是否修改数据库"
                name="readonly"
                // tooltip="执行时是否修改数据库"
                rules={[{ required: true, message: "请选择" }]}
                className={styles[`${PUBLIC_PERFIX_CLASS}-readonly-horizontal`]}
              >
                <Group>
                  <Radio value={false}>否</Radio>
                  <Radio value={true}>是</Radio>
                </Group>
              </Item>
            </Col>
          </Row>

          <Upload {...props}>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
        </Form>
      </Modal>
      <StoredDownLoad
        demoVisible={demoVisible}
        onCancel={() => {
          updateState((draft) => {
            draft.demoVisible = false;
          });
        }}
      />
    </>
  );
};
