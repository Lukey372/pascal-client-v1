import React, { useState, useEffect, ReactNode } from "react"
import {
    Flex,
    Stack,
    Text,
    HStack,
    Code,
    Link,
    useColorModeValue as mode,
    useClipboard,
    useToast,
    Tooltip,
    Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody,
} from "@chakra-ui/react"
import { ExternalLinkIcon, InfoOutlineIcon } from "@chakra-ui/icons"
import { truncate } from "utils/truncateAddress"
import { useWallet } from "@solana/wallet-adapter-react"

const AddressesInfo = (props) => {
    const toast = useToast()
    const { label, value, link } = props
    const { onCopy } = useClipboard(value)

    return (
        <Stack>
            <HStack spacing={3}>
                <Text>{label}</Text>
                <Code fontSize={'xs'} onClick={() => {
                    onCopy();
                    toast({
                        title: 'Address copied to clipboard.',
                        status: 'success',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                        containerStyle: { marginBottom: '25px'},
                    });
                }} cursor={'pointer'}>{truncate(value, 8)}</Code>
                <Link href={`https://solscan.io/account/${link}?cluster=devnet`} isExternal><ExternalLinkIcon /></Link>
            </HStack>
        </Stack>
    )
}

const LiquidityInfo = (props) => {
    const { label, value, children } = props
    return (
      <Flex justify="space-between" fontSize="xs">
        <Text fontWeight="medium" color={mode('gray.600', 'gray.400')}>
            {label}
        </Text>
            {value ? <Text fontWeight="medium">{value}</Text> : children}
      </Flex>
    )
}

export const MarketLiquidityInfo = (props) => {
    const { 
        connection,
        poolAccountA, 
        poolAccountB,
        tokenAccountPool,
        TOKEN_SWAP_PROGRAM_ID,
        isSubmitted
    } = props

    const [poolBalanceA, setPoolBalanceA] = useState<any>(0)
    const [poolBalanceB, setPoolBalanceB] = useState<any>(0)
    const [poolBalanceLP, setPoolBalanceLP] = useState<any>(0)

    const { publicKey } = useWallet()

    useEffect(() => {
        const fetchPoolBalance = async () => {
            try {
                const poolBalanceA = (await connection.getTokenAccountBalance(poolAccountA)).value.uiAmount
                const poolBalanceB = (await connection.getTokenAccountBalance(poolAccountB)).value.uiAmount
                const poolBalanceLP = (await connection.getTokenAccountBalance(tokenAccountPool)).value.uiAmount
                setPoolBalanceA(poolBalanceA?.toLocaleString())
                setPoolBalanceB(poolBalanceB?.toLocaleString())
                setPoolBalanceLP(poolBalanceLP?.toLocaleString())
            } catch (err) {
                console.log("fetchPoolBalance", err)
            }
        }
        
        fetchPoolBalance()

        const interval = setInterval(()=>{
            fetchPoolBalance()
        }, 15000)
        return () => clearInterval(interval)
        
    }, [connection, poolAccountA, poolAccountB, publicKey, tokenAccountPool, isSubmitted])

    return (
        <Stack my={3} spacing={3} p={4} borderWidth={"1px"} rounded={'md'}>
            <LiquidityInfo label={'Pool Liquidity (YES)'} value={`${poolBalanceA} YES`} />
            <LiquidityInfo label={'Pool Liquidity (NO)'} value={`${poolBalanceB} NO`} />
            <LiquidityInfo label={'LP Supply'} value={`${poolBalanceLP} LP`} />
            <LiquidityInfo label={'Addresses'}>
                <Popover placement="bottom-end" isLazy>
                    <PopoverTrigger><InfoOutlineIcon cursor={'help'} /></PopoverTrigger>
                    <PopoverContent width={'full'} boxShadow={'2xl'} bg={mode('#F9FAFB', 'gray.900')}>
                        <PopoverHeader fontSize={'sm'}>Addresses</PopoverHeader>
                        <PopoverBody>
                            <Stack p={2}>
                                <AddressesInfo label={"YES"} value={poolAccountA.toBase58()} link={`${poolAccountA.toBase58()}`} />
                                <AddressesInfo label={"NO"} value={poolAccountB.toBase58()} link={`${poolAccountB.toBase58()}`} />
                                <AddressesInfo label={"LP"} value={tokenAccountPool.toBase58()} link={`${tokenAccountPool.toBase58()}`} />
                                <AddressesInfo label={"AMM ID"} value={TOKEN_SWAP_PROGRAM_ID.toBase58()} link={`${TOKEN_SWAP_PROGRAM_ID.toBase58()}`} />
                            </Stack>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </LiquidityInfo>
            <LiquidityInfo label={'Slippage'} value={'1%'} />
        </Stack>
    )
}

export const CustomTooltip = (props) => {
    const { publicKey, label, children } = props

    return (
        <Tooltip hasArrow label={label} shouldWrapChildren 
            isDisabled={publicKey ? true : false}
            p={3} rounded={'md'} placement={'auto'}
        >
            {children}
        </Tooltip>
    )
}