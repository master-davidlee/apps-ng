import React, { useEffect, useState, useMemo } from 'react'
import styled from "styled-components"
import { observer } from 'mobx-react'
import { Button, Input, Spacer, useInput, useToasts } from '@zeit-ui/react'
import { Plus as PlusIcon } from '@zeit-ui/react-icons'

import { useStore } from "@/store"
import Container from '@/components/Container'
import UnlockRequired from '@/components/accounts/UnlockRequired'
import PushCommandButton from '@/components/PushCommandButton'

import { CONTRACT_HELLOWORLD, createHelloWorldAppStore } from './utils/AppStore'
import { reaction } from 'mobx'

const ButtonWrapper = styled.div`
  margin-top: 5px;
  width: 200px;
`;

/**
 * Header of the HelloWorld app page
 */
const AppHeader = () => (
  <Container>
    <h1>SecretFileBox!</h1>
  </Container>
)

/**
 * Body of the HelloWorld app page
 */
const AppBody = observer(() => {
  const { appRuntime, helloworldApp } = useStore();
  const [, setToast] = useToasts()
  const { state:address, bindings } = useInput('')
  const ele = [];

  /**
   * Updates the counter by querying the helloworld contract
   * The type definitions of `GetCount` request and response can be found at contract/helloworld.rs
   */
  async function updateFiles () {
    if (!helloworldApp) return
    try {
      const response = await helloworldApp.queryFile(appRuntime)
      console.log('Response::GetFile', response);

      helloworldApp.addFile(response.GetFiles.file)
    } catch (err) {
      setToast(err.message, 'error')
    }
  }

  /**
   * The `increment` transaction payload object
   * It follows the command type definition of the contract (at contract/helloworld.rs)
   */
  const addFileCommandPayload = useMemo(() => {
    return {
      AddFile:{
        address:address
      }
    }
    },[address])


    // var ele = [];
    // helloworldApp.files.forEach( item => {
    //   ele.push(
    //     <div>{item}</div>)
    // })
    function getFileStr(list){
      let str = ''
      list.forEach( item => {
        str += '<div>' + item + '</div>'
      })
      return str
    }
  return (
    <Container>
      <section>
        <div>PRuntime: {appRuntime ? 'yes' : 'no'}</div>
        <div>PRuntime ping: {appRuntime.latency || '+∞'}</div>
        <div>PRuntime connected: {appRuntime?.channelReady ? 'yes' : 'no'}</div>
      </section>
      <Spacer y={1}/>

      

      <h3>Secret File Box </h3>
      <section>
          <div>
            <Input label="New file address" {...bindings}/>
            
          </div>
        <ButtonWrapper>
          {/**  
            * PushCommandButton is the easy way to send confidential contract txs.
            * Below it's configurated to send HelloWorld::Increment()
            */}
          <PushCommandButton
              // tx arguments
              contractId={CONTRACT_HELLOWORLD}
              payload={addFileCommandPayload}
              // display messages
              modalTitle='Address'
              modalSubtitle={`upload file  '${address}'`}
              onSuccessMsg='Tx succeeded'
              // button appearance
              buttonType='secondaryLight'
              icon={PlusIcon}
              name='Uplaod File'
            />
        </ButtonWrapper>
      </section>
      <Spacer y={1}/>
      <Spacer y={1}/>

      
      
      <section>
        <div>
           Secret files:{helloworldApp.files===null ?'unknown':helloworldApp.files.toString()}
        </div>
        <Spacer y={1}/>
        <div><Button onClick={updateFiles}>GetAllFiles</Button></div>
        </section>
        <Spacer y={1}/>

        

    </Container>
  )
})

/**
 * Injects the mobx store to the global state once initialized
 */
const StoreInjector = observer(({ children }) => {
  const appStore = useStore()
  const [shouldRenderContent, setShouldRenderContent] = useState(false)

  useEffect(() => {
    if (!appStore || !appStore.appRuntime) return
    if (typeof appStore.hellowrldApp !== 'undefined') return
    appStore.helloworldApp = createHelloWorldAppStore({})
  }, [appStore])

  useEffect(() => reaction(
    () => appStore.helloworldApp,
    () => {
      if (appStore.helloworldApp && !shouldRenderContent) {
        setShouldRenderContent(true)
      }
    },
    { fireImmediately: true })
  )

  return shouldRenderContent && children;
})

export default () => (
  <UnlockRequired>
    <StoreInjector>
      <AppHeader />
      <AppBody />
    </StoreInjector>
  </UnlockRequired>
)
