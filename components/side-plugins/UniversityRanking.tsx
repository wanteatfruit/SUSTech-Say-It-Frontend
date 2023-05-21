import {
  Modal,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';

interface props {
  onClose: () => void;
  isOpen: boolean;
}

interface Row{
    name:string,
    ranking:string,
    city:string,
    location:string
}

function rowKeyGetter(row:Row){
    return row.name;
}
export default function UniversityRankings({ isOpen, onClose }: props) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows,setRows] = useState<Row[]>([{name:'-',ranking:'-',location:'-',city:'-'}]);
  useEffect(() => {
    axios.get("/api/scraperAPI").then((resp) => {
      const data = resp.data
      setRows(data);
    });
  }, []);



  const columns = [
   
    {key:'name',name:'大学'},
    {key:'ranking',name:'QS排名'},
    {key:'location',name:'国家'},
    {key:'city',name:'城市'}
  ]
  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader pb={0}>学校排名</ModalHeader>
        <ModalCloseButton />
        <ModalBody  >
         <DataGrid style={{height:'100%'}} columns={columns}  rowKeyGetter={rowKeyGetter}  rows={rows} />
        </ModalBody>
        <ModalFooter pt={0}>
          <Button onClick={onClose}>关闭</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
