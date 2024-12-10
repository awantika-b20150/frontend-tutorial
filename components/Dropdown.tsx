import React from 'react';
import { Select } from 'antd';
import Prefectures from "@/utils/Pref";

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