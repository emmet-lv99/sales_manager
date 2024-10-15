import { Button, Col, Divider, Form, Input, Row, Table } from 'antd'
import * as Excel from 'exceljs'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SizedBox } from '../common/Common.mjs'



const EditableContext = React.createContext(null)

const workbook = new Excel.Workbook()

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values,
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingInlineEnd: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

export const Page = () => {
  const [message, setMessage] = useState(null)
  // const [a, setA] = useState(null)

  const abcd =  window.abcd
  
  useEffect(() => {
    window.myPreload.tmp(setMessage)
    console.log(abcd)
  }, [abcd])

  const handleClick = () => {
    window.myPreload.copyFile()
  }

  const [dataSource, setDataSource] = useState([
    {
      key: '0',
      name: 'Edward King 0',
      age: '32',
      address: 'London, Park Lane no. 0',
    },
    {
      key: '1',
      name: 'Edward King 1',
      age: '32',
      address: 'London, Park Lane no. 1',
    },
  ])

  const defaultColumns = [
    {
      title: '주문서',
      children: [
        {
          title: '옵션',
          dataIndex: 'name',
          width: '30%',
          editable: true,
        },
      ],
    },
    {
      title: '발주서 반영 사항',
      children: [
        {
          title: '옵션',
          dataIndex: 'name',
          width: '30%',
          editable: true,
        },
        {
          title: '수량(1:N)',
          dataIndex: 'age',
        },
        {
          title: '사은품',
          dataIndex: 'address',
        },
      ],
    },
  ]
  const handleSave = row => {
    const newData = [...dataSource]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setDataSource(newData)
  }
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }
  const columns = defaultColumns.map(col => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  return (
    // TODO: UI 디자인
    <>
      <Row justify="center">
        <Col style={{ backgroundColor: 'lightgray' }} span={20}>
          <SizedBox height={20} />
          <h2>발주서 자동 변환 툴 v1.0</h2>
          <p style={{ lineHeight: '1.7' }}>
            발주서 자동 변환 및 추출 기능을 제공합니다.
            <br />
            파일을 열면 자동으로 복사된 후 작업이 진행됩니다.
          </p>
          <Divider />
          <h4>작업 파일: </h4>
          <SizedBox height={6} />
          <Row justify="end">
            <Button size="large" type="primary">
              반영
            </Button>
          </Row>
          <SizedBox height={6} />
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        </Col>
      </Row>
    </>

    // <div className="App">
    //   <Button>hi</Button>
    // </div>
  )
}

export default Page
