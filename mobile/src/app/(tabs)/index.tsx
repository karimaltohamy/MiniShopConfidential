import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Search, X, ShoppingBag } from 'lucide-react-native';
import { productsApi, Product, Category, PaginatedResponse } from '../../features/products/api/productsApi';
import { useCartStore } from '../../features/cart/store/cartStore';
import { ProductCard } from '../../components/product/ProductCard';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { spacing, borderRadius, typography } from '../../theme';
import { CustomHeader } from '@/components/navigation/CustomHeader';
import { useTheme } from '../../contexts/ThemeContext';

const PAGE_SIZE = 4;

export default function ShopScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const itemCount = useCartStore((state) => state.getItemCount());

  const { theme } = useTheme();
  const c = theme.colors;

  const themedStyles = useMemo(
    () =>
      ({
        container: {
          flex: 1,
          backgroundColor: c.background,
        },
        searchContainer: {
          padding: spacing.md,
          backgroundColor: c.background,
          borderBottomWidth: 1,
          borderBottomColor: c.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        },
        searchInputWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: borderRadius.full,
          paddingHorizontal: spacing.md,
          height: 48,
          borderWidth: 1,
          borderColor: 'transparent',
          backgroundColor: c.surfaceVariant,
        },
        searchIcon: {
          marginRight: spacing.sm,
        },
        searchInput: {
          flex: 1,
          fontSize: typography.fontSize.base,
          color: c.textPrimary,
          paddingVertical: spacing.sm,
        },
        categoriesContainer: {
          borderBottomWidth: 1,
          borderBottomColor: c.border,
        },
        categoriesList: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          gap: spacing.sm,
        },
        categoryChip: {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: borderRadius.full,
          marginRight: spacing.sm,
          borderWidth: 1,
          borderColor: 'transparent',
          backgroundColor: c.surfaceVariant,
        },
        categoryChipActive: {
          backgroundColor: c.primary[500],
        },
        categoryText: {
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: c.textPrimary,
        },
        categoryTextActive: {
          color: '#fff',
        },
        grid: {
          padding: spacing.md,
          gap: spacing.md,
        },
        productItem: {
          flex: 1,
          maxWidth: '50%',
          paddingHorizontal: spacing.xs,
        },
        footer: {
          paddingVertical: spacing.md,
          alignItems: 'center',
        },
        loadingMoreContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingVertical: spacing.sm,
        },
        loadingMoreText: {
          fontSize: typography.fontSize.sm,
          color: c.textSecondary,
        },
        endOfListText: {
          fontSize: typography.fontSize.sm,
          color: c.textSecondary,
          paddingVertical: spacing.sm,
        },
      }) as any,
    [c]
  );

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productsApi.getCategories(),
  });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    isRefetching,
    fetchNextPage,
  } = useInfiniteQuery<PaginatedResponse<Product>, Error>({
    queryKey: ['products', searchQuery, selectedCategory],
    queryFn: ({ pageParam = 1 }) =>
      productsApi.getProducts({
        search: searchQuery || undefined,
        category_id: selectedCategory || undefined,
        page: String(pageParam),
        limit: String(PAGE_SIZE),
      }),
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = lastPage.pagination.totalPages;
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const products = data?.pages.flatMap((page) => page.data) || [];

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleAddToCart = (product: Product) => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
    Alert.alert('Success', `${product.name} added to cart`);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={themedStyles.productItem}>
      <ProductCard
        id={item.id}
        name={item.name}
        price={item.price}
        image_url={item.image_url}
        onPress={() => router.push(`/product/${item.id}`)}
        onAddToCart={() => handleAddToCart(item)}
      />
    </View>
  );

  const renderSkeleton = () => (
    <View style={themedStyles.grid}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={themedStyles.productItem}>
          <Skeleton height={200} style={{ marginBottom: spacing.sm }} />
          <Skeleton height={20} width="80%" style={{ marginBottom: spacing.xs }} />
          <Skeleton height={24} width="40%" />
        </View>
      ))}
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage && products.length === 0) return null;

    return (
      <View style={themedStyles.footer}>
        {isFetchingNextPage ? (
          <View style={themedStyles.loadingMoreContainer}>
            <ActivityIndicator size="small" color={c.primary[500]} />
            <Text style={themedStyles.loadingMoreText}>Loading more products...</Text>
          </View>
        ) : hasNextPage ? null : (
          products.length > 0 && <Text style={themedStyles.endOfListText}>No more products</Text>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
        <CustomHeader
          title="Shop"
          showBack={false}
          showCart
          cartItemCount={itemCount}
          onCartPress={() => router.push('/(tabs)/cart')}
        />
        <View style={themedStyles.searchContainer}>
          <View style={themedStyles.searchInputWrapper}>
            <Search size={20} color={c.textSecondary} style={themedStyles.searchIcon} />
            <TextInput
              style={themedStyles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={c.textDisabled}
              editable={false}
            />
          </View>
        </View>
        <View style={themedStyles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            contentContainerStyle={themedStyles.categoriesList}
            ListHeaderComponent={
              <TouchableOpacity
                style={[themedStyles.categoryChip, themedStyles.categoryChipActive]}
                onPress={() => setSelectedCategory(null)}
              >
                <Text style={[themedStyles.categoryText, themedStyles.categoryTextActive]}>All</Text>
              </TouchableOpacity>
            }
            renderItem={({ item }: { item: Category }) => (
              <TouchableOpacity
                style={[themedStyles.categoryChip, { backgroundColor: c.gray[100] }]}
                onPress={() => setSelectedCategory(item.id)}
              >
                <Text style={[themedStyles.categoryText, { color: c.gray[700] }]}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        {renderSkeleton()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={themedStyles.container} edges={['left', 'right', 'bottom']}>
      <CustomHeader
        title="Shop"
        showBack={false}
        showCart
        cartItemCount={itemCount}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      {/* Search Bar */}
      <View style={themedStyles.searchContainer}>
        <View style={themedStyles.searchInputWrapper}>
          <Search size={20} color={c.textSecondary} style={themedStyles.searchIcon} />
          <TextInput
            style={themedStyles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={c.textDisabled}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={c.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={themedStyles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={themedStyles.categoriesList}
          ListHeaderComponent={
            <TouchableOpacity
              style={[
                themedStyles.categoryChip,
                !selectedCategory && themedStyles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text
                style={[
                  themedStyles.categoryText,
                  !selectedCategory && themedStyles.categoryTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
          }
          renderItem={({ item }: { item: Category }) => (
            <TouchableOpacity
              style={[
                themedStyles.categoryChip,
                selectedCategory === item.id && themedStyles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Text
                style={[
                  themedStyles.categoryText,
                  selectedCategory === item.id && themedStyles.categoryTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Products Grid */}
      {products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products found"
          description={
            searchQuery ? 'Try adjusting your search' : 'No products available'
          }
          actionLabel={searchQuery ? 'Clear Search' : undefined}
          onAction={searchQuery ? () => setSearchQuery('') : undefined}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={themedStyles.grid}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={c.primary[500]}
            />
          }
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
}
