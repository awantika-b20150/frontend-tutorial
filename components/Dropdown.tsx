import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, message, Space } from 'antd';
import Prefectures from "@/components/Pref";

const onClick: MenuProps['onClick'] = ({ key }) => {
  console.log(`Click on ${key}`);
};

const items: MenuProps['items'] = Prefectures;

const Menu: React.FC = () => (
  <Dropdown menu={{ items, onClick }}>
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        Select Prefecture
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default Menu;