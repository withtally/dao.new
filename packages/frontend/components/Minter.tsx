import { VStack } from '@chakra-ui/layout'
import { Table, Tr, Td, Tbody, Select, Thead, Th } from '@chakra-ui/react'
import config from '../config'
import React, { useState } from 'react'
import { IncrementalMinter } from './minter/IncrementalMinter'
import { SpecificIdMinter } from './minter/SpecificIdMinter'

export const Minter = () => {
  const [minterType, setMinterType] = useState('')

  const onMinterTypeChange = (e) => {
    const minterType = e.target.value
    setMinterType(minterType)
  }

  return (
    <>
      <VStack>
        <Select
          placeholder="Select minter type"
          mb={10}
          value={minterType}
          onChange={onMinterTypeChange}
        >
          <option value="incrementalMinter">Incremental minter</option>
          <option value="specificIdMinter">Specific ID minter</option>
        </Select>

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

        {minterType === 'incrementalMinter' ? <IncrementalMinter /> : <></>}
        {minterType === 'specificIdMinter' ? <SpecificIdMinter /> : <></>}
      </VStack>
    </>
  )
}
