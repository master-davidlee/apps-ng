import { types, flow } from 'mobx-state-tree'

export const CONTRACT_HELLOWORLD = 5;

export const createHelloWorldAppStore = (defaultValue = {}, options = {}) => {
  const HelloWorldAppStore = types
    .model('HelloWorldAppStore', {
      counter: types.maybeNull(types.number),
      files: types.maybeNull(types.array(types.string)),
    })
    .actions(self => ({
      setCounter (num) {
        self.counter = num
      },
      async queryCounter (runtime) {
        return await runtime.query(CONTRACT_HELLOWORLD, 'GetCount')
      },
      addFile(file){
         self.files = file
      },
      async queryFile (runtime) {
        return await runtime.query(CONTRACT_HELLOWORLD, 'GetFiles')
      },

    }))

  return HelloWorldAppStore.create(defaultValue)
}
