import { Table, Tr, Td, Tbody, Thead, Th } from '@chakra-ui/react'
import config from '../../config'

export const ContractsTable = () => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Contract</Th>
          <Th>Address</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Token</Td>
          <Td>{config.tokenAddress}</Td>
        </Tr>
        <Tr>
          <Td>Minter</Td>
          <Td>{config.minterAddress}</Td>
        </Tr>
        <Tr>
          <Td>Timelock</Td>
          <Td>{config.timelockAddress}</Td>
        </Tr>
      </Tbody>
    </Table>
  )
}
