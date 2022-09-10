import { 
    Box, 
    Heading,
    Tabs, TabList, TabPanels, Tab, TabPanel,
} from "@chakra-ui/react"
import WithSubnavigation from "components/TopBar"
import { Stats } from "components/Portfolio/Stat"
import { PositionsTable } from "../components/Portfolio/PositionsTable"
import styles from '../styles/Home.module.css'
import { ReturnsGraph } from "components/Portfolio/ReturnsGraph"
import ActivityTable from "components/Portfolio/ActivityTable"
import Layout from "components/Layout"

function Portfolio({ data }) {

    return (
        <div className={styles.container}>
            <WithSubnavigation />
            
            <Layout>
                <Box as="section" py="12">
                    <Box maxW={{ base: '3xl', lg: '5xl' }}
                        mx="auto"
                    >
                        <Box overflowX="auto">
                            <Heading size="xl" mb="6">
                                Your Portfolio
                            </Heading>
                            
                            <Stats />

                            <Tabs py={10} variant={'enclosed'} colorScheme={'black'}>
                                <TabList>
                                    <Tab>Returns</Tab>
                                    <Tab>Activity</Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel key={1} px={0}>
                                        <ReturnsGraph />
                                        <PositionsTable />
                                    </TabPanel>

                                    <TabPanel key={2} px={0}>
                                        <ActivityTable />
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Box>
                    </Box>
                </Box>
            </Layout>
        </div>
    )
}

// Page gets called at build time
// export async function getStaticProps() {

// }

export default Portfolio