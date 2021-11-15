import { VStack } from '@chakra-ui/layout'
import { Select } from '@chakra-ui/react'
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

        {minterType === 'incrementalMinter' ? <IncrementalMinter /> : <></>}
        {minterType === 'specificIdMinter' ? <SpecificIdMinter /> : <></>}
      </VStack>
    </>
  )
}
