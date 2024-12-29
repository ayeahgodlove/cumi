"use client";

import PageBreadCrumbs from "@components/shared/page-breadcrumb/page-breadcrumb.component";
import { IQuiz } from "@domain/models/quiz";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { BaseRecord } from "@refinedev/core";
import { format } from "@utils/format";
import { Image, Space, Table, Tag } from "antd";

export default function QuizList() {
  const { tableProps, tableQueryResult } = useTable({
    syncWithLocation: true,
  });

  return (
    <>
      <PageBreadCrumbs items={["Quizes", "Lists"]} />
      <List>
        <Table {...tableProps} rowKey="id">
          <Table.Column
            dataIndex="id"
            title={"ID"}
            render={(value, record, index) =>
              format.twoChar((index + 1).toString())
            }
          />
          <Table.Column dataIndex="question" title={"Question"} />
          <Table.Column
            dataIndex="answers"
            title={"Answers"}
            render={(_, record: IQuiz) =>
              record.answers.map((rec, index) => (
                <Tag
                  key={rec}
                  color={
                    index === record.correctAnswerIndex ? "green" : "magenta"
                  }
                >
                  {rec}
                </Tag>
              ))
            }
          />
          <Table.Column dataIndex="correctAnswerIndex" title={"Correct Answer"} />
         
          <Table.Column
            title={"Actions"}
            dataIndex="actions"
            render={(_, record: BaseRecord) => (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            )}
          />
        </Table>
      </List>
    </>
  );
}
