import axios from 'axios'
import { secrets, etherscanEndpoint } from '../config'
import qs from 'qs'

export async function verifyProxy(address: string) {
  const body = qs.stringify({ address })
  const res = await axios.post(`${etherscanEndpoint}api`, body, {
    params: {
      module: 'contract',
      action: 'verifyproxycontract',
      apikey: secrets.etherscanApiKey,
    },
  })

  return {
    success: res.data.status === '1',
    messageOrGuid: res.data.result,
  }
}

export async function checkProxyVerification(guid: string) {
  const res = await axios.get(`${etherscanEndpoint}api`, {
    params: {
      module: 'contract',
      action: 'checkproxyverification',
      guid,
      apikey: secrets.etherscanApiKey,
    },
  })

  return {
    success: res.data.status === '1',
    message: res.data.result,
  }
}
