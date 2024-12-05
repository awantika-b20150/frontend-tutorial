import React from 'react';
import { Select } from 'antd';
import Prefectures from "@/components/Pref";

const onClick = (value: string) => {
  console.log(`Click on ${value}`);
};
const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log('search:', value);
};

const Menu: React.FC = () => (
  <Select
    showSearch
    placeholder="Select prefecture"
    optionFilterProp="label"
    onChange={onChange}
    onSearch={onSearch}
    options={Prefectures}
  />
);

export default Menu;