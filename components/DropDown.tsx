import { Select } from 'antd';
import Prefectures from '@/utils/Pref';

interface DropDownProps {
    onChange?: (input:string) => void;
    value?: string;
  
}
export default function DropDown({onChange,value}:DropDownProps){
  return(
    <Select
        showSearch
        placeholder="Select prefecture"
        optionFilterProp="label"
        onChange={onChange}
        options={Prefectures}
        value={value}
    />
  );

}