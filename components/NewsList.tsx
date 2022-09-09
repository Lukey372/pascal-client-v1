import React, { useState, Suspense } from 'react';
import {
  Box,
  Heading,
  Image,
  Text,
  Stack,
  Flex,
  Skeleton, SkeletonText,
  HStack,
  Link,
  Tooltip,
  Button,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((res) => res.json());

// Style config
const paginationStyle = {
    alignItems: 'center',
    justifyContent: 'space-between',
    py: 2,
}

interface NewsListItemProp {
    publication: string,
    title: string,
    imageUrl?: string
    datePublished: string,
    url: string,
}

// TODO: change client-side to server-side and add caching
const NewsListItem = (props: NewsListItemProp) => {
    const { publication, title, imageUrl, datePublished, url } = props

    return (
        <Link href={url} isExternal _hover={{ textDecoration: 'none' }}>
            <Box borderWidth={'1px'} p={{ 'base': 4, 'md': 5 }} rounded={'lg'}
                width={{ 'base': '80%', 'md': 'full' }}
                height={{ 'base': '150px', 'md': 'full' }}
                marginTop={1}
                display="flex"
                justifyContent="space-between"
                transition={'border-color 0.3s linear'}
                _hover={{ borderColor:'gray.400' }}>
                
                    <Flex>
                        <Image width={{ 'base': '110px', 'md':'150px' }} height={{ 'base': 'fit', 'md': '100px' }}
                            borderRadius="md"
                            src={imageUrl}
                            alt={title}
                            objectFit="cover"
                            fallback={<Skeleton width={{ 'base': '110px', 'md':'150px' }} height={{ 'base': 'fit', 'md': '100px' }} />}
                        />
                    </Flex>
                
                    <Stack
                        display="flex"
                        flex="1"
                        flexDirection="column"
                        px={2}
                        ml={4}>
                        <Suspense fallback={<SkeletonText width={{ 'base': '80%', 'md': 'full' }}/>}>
                            <Stack spacing={{ 'base': 1, 'md': '3' }} direction={{ 'base': 'column', 'md': 'row' }}>
                                <Heading fontSize={{ 'base': 'sm', 'md': 'md' }}>{publication}</Heading>
                                <Text fontSize={{ 'base': 'xs', 'md': 'sm' }} fontWeight={'semibold'} color='gray'>{datePublished}</Text>
                            </Stack>
                        </Suspense>

                        <Suspense fallback={<SkeletonText width={{ 'base': '80%', 'md': 'full' }} />}>
                            <Text fontSize={{ 'base': 'sm', 'md': 'md' }} marginTop="1" overflow={'hidden'} textOverflow={'ellipsis'}>
                                {title}
                            </Text>
                        </Suspense>
                    </Stack>

            </Box>
        </Link>
    )
}

function timeElapsed(time) {
    const now = new Date()
    const publishedTime = new Date(time)
    const timeDiff = (now.getTime() - publishedTime.getTime()) / (1000 * 60) // minutes

    if (timeDiff >= 60 && timeDiff < 1440) {
        return `${Math.floor(timeDiff / 60)} hours`
    } else if (timeDiff >= 1440) {
        return `${Math.floor(timeDiff / (60 * 24))} days`
    }

    return `${Math.floor(timeDiff)} minutes`
}

export const Page = ({ search, index }) => {
    const { data, error } = useSWR(
        `https://newsapi.org/v2/everything?q=${search}&sortBy=popularity&page=${index}&language=en&pageSize=4&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`,
        fetcher
    )
    console.log("Is news data ready?", !!data)
    if (error) return "An error has occured loading the news feed"
    if (!data) return <Suspense fallback={<SkeletonText width={'full'}/>} />
    console.log(data)
    if (data) return ( 
        data.articles.map((news, index) => (
            <NewsListItem key={index} 
                publication={news.source.name}
                // Get time elapsed since each news published
                datePublished={`${timeElapsed(news.publishedAt)} ago`}
                imageUrl={news?.urlToImage} 
                title={news.title}
                url={news.url}
            />
        ))
    )
}

// TODO: add page numbers for pagination buttons
export const NewsList = ({ market }) => {    
    const [pageIndex, setPageIndex] = useState(1)

    return (
        <Stack paddingTop={16}>
            <Flex justify={'space-between'}>
                <Heading fontSize={'2xl'} paddingBottom={2}>In the news</Heading>
                <Tooltip label='This news feed is served by Google News.' 
                    fontSize='sm' padding={3}
                    hasArrow arrowSize={15} placement='left'
                    >
                    <InfoOutlineIcon px={2} w={9} h={9} cursor={'help'} />
                </Tooltip>
            </Flex>

            <Page index={pageIndex} search={market.search_term} />
            <div style={{ display: 'none' }}><Page index={pageIndex + 1} search={market.search_term}/></div>

            {pageIndex == 1 ?
                (
                    <Flex sx={paginationStyle} width={{ 'base': '80%', 'md': 'full' }}>
                        <Text color={mode('gray.600', 'gray.400')} fontSize={{ 'base': 'xs', 'md': 'sm'}}>
                            Showing 1 to 4 of 8 results
                        </Text>
                        <Button onClick={() => setPageIndex(pageIndex + 1)} size={{ 'base': 'sm', 'md': 'md' }} fontSize={'sm'} fontWeight={'normal'}>
                            Next
                        </Button>
                    </Flex>
                )
                : 
                (
                    <Flex sx={paginationStyle} width={{ 'base': '80%', 'md': 'full' }}>
                        <Text color={mode('gray.600', 'gray.400')} fontSize={{ 'base': 'xs', 'md': 'sm'}}>
                            Showing 5 to 8 of 8 results
                        </Text>
                        <Button onClick={() => setPageIndex(pageIndex - 1)} size={{ 'base': 'sm', 'md': 'md' }}  fontSize={'sm'} fontWeight={'normal'}>
                            Prev
                        </Button>
                    </Flex>
                )
            }
        </Stack>
    )
}

export default NewsList