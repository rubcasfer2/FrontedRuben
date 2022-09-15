import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ControlPanelScreen from './ControlPanelScreen'
const Stack = createNativeStackNavigator()


export default function ControlStack(){
    return(
        <Stack.Navigator>
            <Stack.Screen
            name='ControlPanel'
            component={ControlPanelScreen}
            options={{
                title:'My Orders'
            }}/>
              </Stack.Navigator>
    )
}