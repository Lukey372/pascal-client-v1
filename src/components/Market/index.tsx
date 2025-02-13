import React from 'react'
import Head from 'next/head'
import {
    Box, Divider,
    Stack, HStack, SimpleGrid,
    Heading,
    Flex, 
    Tab, Tabs, TabList, TabPanels, TabPanel, 
    useColorModeValue as mode,
    Image,
} from '@chakra-ui/react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import MarketProgress from './MarketProgress'
import { Stat } from './Stat'
import NewsList from './NewsList'
import { TradeForm } from './TradeForm'
import WithSubnavigation from '../TopBar'
import MarketResolution from './MarketResolution'
import Outcomes from './Outcomes'
import { DiscussionForm, DiscussionList } from './Discussion'
import Layout from '../Layout'
import ChakraNextLink from '../ChakraNextLink'
import { useWallet } from '@solana/wallet-adapter-react'
import styles from '@/styles/Home.module.css'

// Dynamically load ResearchGraph component on client side
const ResearchGraph = dynamic(import('./ResearchGraph'), {
    ssr: false
})

const MarketView = ({ market }) => {
    const router = useRouter()

    const { publicKey } = useWallet()
    const isOwner = ( publicKey ? publicKey.toString() === process.env.NEXT_PUBLIC_OWNER_PUBLIC_KEY : false )

    // Style config
    const dividerColor = mode('gray.300', '#464A54')
    const iconColor = mode('invert(0%)', 'invert(100%)')
    const tabListStyle = {
        fontWeight:' semibold',
        fontSize: 'lg',
        px: 0,
        textColor: 'gray.400',
        _selected: {
            textColor: mode('black', 'gray.100'),
            borderColor: mode('black', 'gray.100')
        }
    }
    const sectionHeadingStyle = {
        fontSize: 'lg',
        fontWeight: 'bold'
    }
    const gradientBackgroundStyle = {
        filter: 'blur(110px)',
        position: 'absolute',
        zIndex: -1,
        opacity: '50%',
        width: '40%',
    }
    // Style config
    const stats = [
        { label: 'Liquidity', value: market.liquidity },
        { label: 'Total Volume', value: market.volume },
        { label: 'Closing Date - UTC', value: new Date(market.closing_date).toISOString().split('T')[0] },
    ]

    return (
        <div className={styles.container}>
        <Head>
            <title>{market.title}</title>
            <meta name="description" content="Trade directly on the outcome of events" />
            <meta property="og:title" content={market.title} />
            <meta
            property="og:description"
            content="Trade directly on the outcome of events"
            />
            <meta
            property="og:image"
            content="/Preview.png"
            />
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <WithSubnavigation />

        <Layout>
            <Box
                overflow={{ 'base': 'hidden', 'lg': 'visible' }}
                maxW={{ base: '3xl', lg: '5xl' }}
                mx="auto"
                px={{ base: '1', md: '8', lg: '12' }}
                py={{ base: '6', md: '8', lg: '14' }}
            >
                <ChakraNextLink to={'/'} _hover={{textDecoration: 'none'}} display={'inline-block'}>
                    <Stack mb={6} align={'center'} direction={'row'} width={{ 'base': 'full', 'md': 'full' }}>
                        <HStack className={styles.text_link} _before={{ bg: mode('black', 'white') }}>
                            <ArrowBackIcon mr={4}/>
                            <Heading _before={{ bg: mode('black', 'white') }}
                                fontSize={{ 'base': 'xl', 'md': '2xl' }} fontWeight="extrabold"
                            >
                                {market.title}
                            </Heading>
                        </HStack>
                    </Stack>
                </ChakraNextLink>

                <Stack
                    direction={{ base: 'column', lg: 'row' }}
                    align={{ lg: 'flex-start' }}
                    spacing={5}
                >
                    <Stack spacing={{ base: '8', md: '10' }} minW={'sm'} flex="2">
                        <Tabs colorScheme={'black'}>
                            <TabList>
                                <Tab sx={tabListStyle}>Outcomes</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel key={0} px={0}>
                                    <Outcomes market={market} />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>

                        <Tabs isLazy colorScheme={'black'}> {/* isLazy defers rendering until tab is selected */}
                            <TabList>
                                <Tab sx={tabListStyle} mr={7}>About</Tab>
                                <Tab sx={tabListStyle}>Research and News</Tab>
                            </TabList>

                            <TabPanels>
                                <TabPanel key={0} px={0}>
                                    <Flex flexDirection={'column'}>
                                        <Stack>
                                            <MarketProgress market={market} />
                                            
                                            <Divider borderColor={dividerColor} />

                                            {/* Statistics */}
                                            <Stack py={3} direction={'column'}>
                                                <HStack spacing={3}>
                                                    <Image filter={iconColor} alt='Statistics' width={'18px'} src={`/Statistics.png`} />
                                                    <Heading sx={sectionHeadingStyle}>Statistics</Heading>
                                                </HStack>
                                                <SimpleGrid columns={{ base: 2, md: 3 }}>
                                                    {stats.map(({ label, value }) => (
                                                    <Stat key={label} label={label} value={value} />
                                                    ))}
                                                </SimpleGrid>
                                            </Stack>

                                            <Divider borderColor={dividerColor} />

                                            {/* Market Resolution */}
                                            <Stack py={3} direction={'column'}>
                                                <HStack spacing={3}>
                                                    <Image filter={iconColor} alt='Resolution' width={'18px'} src={`/Resolution.png`} />
                                                    <Heading sx={sectionHeadingStyle}>Market Resolution</Heading>
                                                </HStack>
                                                
                                                <MarketResolution market={market} />
                                            </Stack>

                                            <Divider borderColor={dividerColor} />

                                            {/* Discussion */}
                                            {/* <Stack py={3} direction={'column'}>
                                                <HStack spacing={3}>
                                                    <Image filter={iconColor} alt='Discussion' width={'18px'} src={`/Discussion.png`} />
                                                    <Heading sx={sectionHeadingStyle}>Discussion</Heading>
                                                </HStack>

                                                <DiscussionForm />
                                                <DiscussionList />
                                            </Stack> */}
                                        </Stack>
                                    </Flex>
                                </TabPanel>

                                <TabPanel key={1} px={0}>
                                    <Stack marginTop={5}>
                                        {(market.category === "Financials" || market.category === "Crypto") 
                                            && <ResearchGraph market={market} 
                                        />}
                                        <NewsList market={market} />
                                    </Stack>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Stack>

                    <Flex direction="column" align={'center'}
                        position={{ 'sm': 'relative', 'lg': 'sticky'}} 
                        top={{ 'base': 'none', 'lg': '20' }}
                    >
                        <TradeForm market={market} />
                    </Flex>

                    <Image sx={gradientBackgroundStyle} src={'/gradient-bg1.png'}
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        alt={'background'} right={'100px'} transform={'rotate(280deg)'} 
                    />
                </Stack>
            </Box>
        </Layout>
        </div>
    )
}

export default MarketView