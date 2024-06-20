/* eslint-disable no-unused-vars */
import React from 'react';
import { Button, useColorMode } from '@chakra-ui/react';

    function DarkModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button onClick={toggleColorMode} variant="outline"  className="m-2 p-2 border border-gray-400 rounded" >
        {colorMode === 'light' ? 'Dark' : 'Light'} Mode
        </Button>
    );
}

export default DarkModeToggle;
